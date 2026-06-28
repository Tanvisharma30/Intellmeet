const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  roomId: String,
  transcript: String,
  summary: String,
  actionItems: [String],
}, { timestamps: true });

module.exports = mongoose.model("MeetingHistory", schema);