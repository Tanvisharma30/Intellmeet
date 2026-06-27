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

// ---------------- SOCKET ----------------
const io = new Server(server, {
  cors: { origin: "*" },
});

require("./sockets/socket")(io);

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// ---------------- ROUTES ----------------

// AUTH
app.use("/api/auth", require("./routes/authRoutes"));

// MEETINGS
app.use("/api/meetings", require("./routes/meetingRoutes"));

// ---------------- WEEK 3 AI ROUTES ----------------
app.use("/api/ai", require("./routes/aiTranscribe"));
app.use("/api/ai", require("./routes/summary"));

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.send("🚀 IntellMeet Backend Running");
});

// ---------------- DATABASE ----------------
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