const express = require("express");
const router = express.Router();
const MeetingHistory = require("../models/MeetingHistory");

// SAVE MEETING
router.post("/save", async (req, res) => {
  try {
    const { roomId, transcript, summary, actionItems } = req.body;

    const meeting = new MeetingHistory({
      roomId,
      transcript,
      summary,
      actionItems,
    });

    await meeting.save();

    res.json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL HISTORY
router.get("/all", async (req, res) => {
  try {
    const data = await MeetingHistory.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;