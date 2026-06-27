const express = require("express");
const router = express.Router();
const MeetingSummary = require("../models/MeetingSummary");

// SAVE AFTER AI GENERATION
router.post("/save", async (req, res) => {
  try {
    const { roomId, transcript, summary } = req.body;

    const data = await MeetingSummary.create({
      roomId,
      transcript,
      summary,
    });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET HISTORY
router.get("/history", async (req, res) => {
  const data = await MeetingSummary.find().sort({ createdAt: -1 });
  res.json(data);
});

module.exports = router;