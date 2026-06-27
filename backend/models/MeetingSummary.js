const mongoose = require("mongoose");

const meetingSummarySchema = new mongoose.Schema(
  {
    roomId: String,
    transcript: String,
    summary: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MeetingSummary", meetingSummarySchema);