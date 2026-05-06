import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoute from "./routes/upload.js";
import chatRoute from "./routes/chat.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoute);
app.use("/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("DocTalk API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});