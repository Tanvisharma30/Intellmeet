const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// test route
app.get("/", (req, res) => {
  res.send("🚀 IntellMeet Backend is Running");
});

// connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ DB Connection Error:", err.message);
  });