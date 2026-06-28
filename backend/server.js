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

// SOCKET
const io = new Server(server, {
  cors: { origin: "*" },
});

require("./sockets/socket")(io);

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/meetings", require("./routes/meetingRoutes"));

// AI ROUTES
app.use("/api/ai", require("./routes/aiTranscribe"));
app.use("/api/ai", require("./routes/summary"));

// TASKS (KANBAN)
app.use("/api/tasks", require("./routes/taskRoutes"));

// HISTORY
app.use("/api/history", require("./routes/history"));

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("IntellMeet Running");
});

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(5000, () => {
      console.log("Server running on 5000");
    });
  })
  .catch(console.log);