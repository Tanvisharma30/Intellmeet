const express = require("express");
const Task = require("../models/Task");
const Notification = require("../models/Notification");

const router = express.Router();

// GET tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ roomId: req.query.roomId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE task + notification
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);

    await Notification.create({
      type: "task",
      message: `New task created: ${task.title}`,
      roomId: task.roomId,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE task + notification
router.put("/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    );

    await Notification.create({
      type: "task",
      message: `Task updated: ${updated.title} → ${updated.status}`,
      roomId: updated.roomId,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;