const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

// GET notifications
router.get("/", async (req, res) => {
  try {
    const data = await Notification.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE notification
router.post("/", async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MARK AS READ
router.put("/:id", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true } // FIXED (CommonJS safe + correct Mongoose option)
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;