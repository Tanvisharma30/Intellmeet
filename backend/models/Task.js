const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  roomId: String,
  title: String,
  status: { type: String, default: "todo" },
  assignedTo: String,
}, { timestamps: true });

module.exports = mongoose.model("Task", schema);