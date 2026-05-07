import express from "express";
import multer from "multer";
import fs from "fs";
import PDFParser from "pdf2json";
import { randomUUID } from "crypto";
import { supabase } from "../db.js";
import { chunkText } from "../utils/chunk.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

//PDF TEXT EXTRACTION (pdf2json)

function extractTextFromPDF(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(err.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      let text = "";

      pdfData.Pages.forEach((page) => {
        page.Texts.forEach((textItem) => {
          textItem.R.forEach((r) => {
            text += decodeURIComponent(r.T) + " ";
          });
        });
        text += "\n";
      });

      resolve(text);
    });

    pdfParser.loadPDF(filePath);
  });
}


//GEMINI EMBEDDING

async function getEmbedding(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-2",
        content: {
          parts: [{ text: text }]
        }
      }),
    }
  );

  const raw = await response.text();
  const data = JSON.parse(raw);

  if (!data.embedding?.values) {
    throw new Error("No embedding in response: " + raw.slice(0, 200));
  }

  return data.embedding.values;
}

//UPLOAD ROUTE

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const documentId = randomUUID();
    console.log("STEP 1: File received");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    console.log("STEP 2: Extracting text");

    const text = await extractTextFromPDF(filePath);

    if (!text || text.trim().length === 0) {
      throw new Error("No readable text in PDF");
    }

    console.log("Text length:", text.length);

    console.log("STEP 3: Chunking");

    const chunks = chunkText(text);
    console.log("Chunks:", chunks.length);

    const limitedChunks = chunks.slice(0, 20);

    console.log("STEP 4: Embedding + DB");

    for (const chunk of limitedChunks) {
      const clean = chunk.slice(0, 1000);

      const embedding = await getEmbedding(clean);

      await supabase.from("documents").insert([
        {
          content: chunk,
          embedding: embedding,
          document_id: documentId,
        },
      ]);

      const { error } = await supabase.from("documents").insert([
        {
          content: clean,
          embedding: embedding,
        },
      ]);

      if (error) {
        console.error("DB ERROR:", error);
        throw new Error("DB insert failed");
      }
    }

    console.log("STEP 5: Cleanup");

    fs.unlinkSync(filePath);

    res.json({
      message: "Upload success",
      chunksStored: limitedChunks.length,
      documentId: documentId
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    }

    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;