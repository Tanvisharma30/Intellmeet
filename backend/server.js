const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const taskRoutes = require("./routes/taskRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const notificationRoutes = require("./routes/notificationRoutes"); 
// 🔥 IMPORT SOCKET FILE (IMPORTANT FIX)
const socketHandler = require("./sockets/socket");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/tasks", taskRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);

// create HTTP server
const server = http.createServer(app);

// socket setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  // send notification
  socket.on("send-notification", (data) => {
    io.to(data.roomId).emit("receive-notification", {
      message: data.message,
      type: data.type || "info",
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
}); 

// 🔥 THIS IS THE FIX (was initSocket)
socketHandler(io);


// DB + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(5000, () =>
      console.log("Server running on 5000")
    );
  })
  .catch(console.log);