import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// GET tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find({ roomId: req.query.roomId });
  res.json(tasks);
});

// CREATE task
router.post("/", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

// UPDATE task (THIS FIXES YOUR PUT ISSUE)
router.put("/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;