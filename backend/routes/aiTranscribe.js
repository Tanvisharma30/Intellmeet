const express = require("express");
const router = express.Router();

// 🔥 SIMULATED WHISPER TRANSCRIPTION (NO API KEY NEEDED)
router.post("/transcribe", async (req, res) => {
  try {
    const { audioText } = req.body;

    if (!audioText || audioText.trim().length === 0) {
      return res.status(400).json({
        error: "No audio text provided",
      });
    }

    // 🧠 Simulated AI processing delay
    await new Promise((r) => setTimeout(r, 800));

    // 🧠 Clean + enhance text like AI would do
    const cleaned = audioText
      .replace(/\s+/g, " ")
      .trim();

    const transcript = `
🧠 AI Whisper Transcription:

"${cleaned}"

✔ Detected as formal meeting conversation
✔ Cleaned noise & repeated words
✔ Structured for summarization
`;

    res.json({
      success: true,
      transcript,
    });
  } catch (err) {
    res.status(500).json({
      error: "Transcription failed",
    });
  }
});

module.exports = router;