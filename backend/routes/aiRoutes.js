const express = require("express");

const router = express.Router();

// TRANSCRIBE (mock)
router.post("/transcribe", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const transcript = text.split(" ").join(" ");

    res.json({
      success: true,
      transcript,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SUMMARY (mock)
router.post("/summary", async (req, res) => {
  try {
    const { transcript } = req.body;

    const summary = `Summary: ${transcript.slice(0, 80)}...`;

    const actionItems = [
      "Follow up discussion",
      "Create tasks",
      "Assign work",
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