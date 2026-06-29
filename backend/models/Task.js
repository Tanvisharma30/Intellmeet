const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  status: String,
  roomId: String,
});

module.exports = mongoose.model("Task", taskSchema);