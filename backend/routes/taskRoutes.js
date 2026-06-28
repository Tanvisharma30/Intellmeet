const router = require("express").Router();
const Task = require("../models/Task");

router.get("/", async (req, res) => {
  const { roomId } = req.query;

  const tasks = await Task.find(roomId ? { roomId } : {});
  res.json(tasks);
});
router.post("/", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

router.put("/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
}); 
// UPDATE TASK STATUS ONLY
router.patch("/:id/status", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;