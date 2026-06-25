const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ---------------- SOCKET SETUP ----------------
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// socket logic
require("./sockets/socket")(io);

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// ---------------- ROUTES ----------------

// AUTH ROUTES
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// MEETING ROUTES
const meetingRoutes = require("./routes/meetingRoutes");
app.use("/api/meetings", meetingRoutes);

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("🚀 IntellMeet Backend is Running");
});

// ---------------- DATABASE CONNECTION ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });