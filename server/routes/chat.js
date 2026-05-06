import express from "express";
import Groq from "groq-sdk";
import { supabase } from "../db.js";
import { getEmbedding } from "../utils/embedding.js";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // 1. Convert question to embedding
    const queryEmbedding = await getEmbedding(question);

    // 2. Fetch similar documents from Supabase
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_count: 5,
    });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Search failed" });
    }

    console.log("Similarity scores:", data.map((d) => d.similarity));

    // 3. Combine retrieved context
    const context = data.map((item) => item.content).join("\n\n");

    // 4. Build prompt
    const prompt = `You are a document-based assistant.
    Rules:
    - Answer ONLY using the provided context.
    - If the answer is not in the context, reply: "Not in document".
    - Keep answers concise and accurate.

    Context:
    ${context}

    Question:
    ${question}

    Answer:`;

    // 5. Groq inference
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 300,
    });

    const answer = completion.choices[0]?.message?.content?.trim() || "No response";

    console.log("Answer:", answer);

    // 6. Return response
    res.json({
      answer,
      sources: data,
    });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

export default router;