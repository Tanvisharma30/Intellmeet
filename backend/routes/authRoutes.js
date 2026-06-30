const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/jwt");

// TEMP USER DB (replace later with MongoDB model)
const users = [];

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now(),
    name,
    email,
    password: hashed,
  };

  users.push(user);

  const token = generateToken(user);

  res.json({ token, user: { name, email } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Invalid password" });

  const token = generateToken(user);

  res.json({ token, user: { name: user.name, email: user.email } });
});

module.exports = router;