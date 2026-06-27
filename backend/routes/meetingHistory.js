const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting");

// SAVE meeting
router.post("/save", async (req, res) => {
  try {
    const { roomId, participants, transcript, summary, actionItems } = req.body;

    const meeting = await Meeting.create({
      roomId,
      participants,
      transcript,
      summary,
      actionItems,
    });

    res.json({
      success: true,
      meeting,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET history
router.get("/all", async (req, res) => {
  const meetings = await Meeting.find().sort({ createdAt: -1 });
  res.json(meetings);
});

module.exports = router;