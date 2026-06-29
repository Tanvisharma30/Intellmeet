const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "global" },
    type: String, // task, ai, meeting, system
    message: String,
    read: { type: Boolean, default: false },
    roomId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);