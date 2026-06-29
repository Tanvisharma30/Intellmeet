const Meeting = require("../models/Meeting");

// CREATE MEETING
exports.createMeeting = async (req, res) => {
  try {
    const { roomId, participants, transcript, summary, actionItems } = req.body;

    const meeting = await Meeting.create({
      roomId,
      participants,
      transcript,
      summary,
      actionItems,
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