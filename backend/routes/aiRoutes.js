const express = require("express");
const router = express.Router();

/**
 * REAL TRANSCRIPTION (TEMP MOCK - upgrade later to Whisper)
 */
router.post("/transcribe", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    // Simulated AI transcription (we will replace with OpenAI later)
    const transcript = text
      .split(" ")
      .map((word, i) => `${word}`)
      .join(" ");

    res.json({
      success: true,
      transcript,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * REAL SUMMARY (TEMP LOGIC)
 */
router.post("/summary", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "No transcript provided" });
    }

    const summary = `Summary: This meeting discussed ${transcript.slice(0, 80)}...`;

    const actionItems = [
      "Follow up on discussion points",
      "Create task list from meeting",
      "Assign responsibilities"
    ];

    res.json({
      success: true,
      summary,
      actionItems,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;