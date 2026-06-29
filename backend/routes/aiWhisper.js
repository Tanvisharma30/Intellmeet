import express from "express";
import multer from "multer";
import OpenAI from "openai";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🎤 Whisper
router.post("/whisper", upload.single("audio"), async (req, res) => {
  try {
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-1",
    });

    res.json({ text: transcription.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;