const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io"); 
const Sentry = require("@sentry/node");

const taskRoutes = require("./routes/taskRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const notificationRoutes = require("./routes/notificationRoutes"); 
// 🔥 IMPORT SOCKET FILE (IMPORTANT FIX)
const socketHandler = require("./sockets/socket"); 
const scheduleRoutes = require("./routes/scheduleRoutes");

dotenv.config();
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
const app = express(); 
app.use(cors({ 
  origin: "https://intellmeet-frontend-n9zu-b6gdhg9qt-tanvis136-6694s-projects.vercel.app", 
  credentials: true,



}));
app.use(express.json()); 

app.get("/", (req, res) => {
  res.json({
    project: "IntellMeet Backend",
    status: "Running",
    message: "Backend deployed successfully on Render"
  });
});

// routes
app.use("/api/tasks", taskRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes); 
app.use("/api/schedule",scheduleRoutes); 

app.use(Sentry.expressErrorHandler());
// create HTTP server
const server = http.createServer(app);

// socket setup
const io = new Server(server, {
  cors: {
    origin: "https://intellmeet-frontend-n9zu-b6gdhg9qt-tanvis136-6694s-projects.vercel.app", 
    methods: ["GET", "POST"]
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

const PORT = process.env.PORT || 5000;

// DB + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected"); 
    
    server.listen(PORT, () =>
      console.log("Server running on",PORT)
    );
  })
  .catch(console.log);