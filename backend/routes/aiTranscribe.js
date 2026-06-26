const express = require("express");
const router = express.Router();

// SIMPLE TEST VERSION (we will upgrade to Whisper later)
router.post("/transcribe", async (req, res) => {
  try {
    const { audioText } = req.body;

    if (!audioText) {
      return res.status(400).json({ error: "No audio text provided" });
    }

    // MOCK AI TRANSCRIPTION
    const transcript = `Transcribed: ${audioText}`;

    res.json({
      success: true,
      transcript,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;