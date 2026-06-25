const Meeting = require("../models/Meeting");

// CREATE MEETING
exports.createMeeting = async (req, res) => {
  try {
    const roomId = Math.random().toString(36).substring(2, 8);

    const meeting = await Meeting.create({
      roomId,
      host: req.user.id,
    });

    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL MEETINGS
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};