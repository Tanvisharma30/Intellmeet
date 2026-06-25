module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // JOIN ROOM
    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      console.log(`User ${socket.id} joined room ${roomId}`);

      socket.to(roomId).emit("user-connected", socket.id);

      socket.emit("joined-room", roomId);
    });

    // CHAT
    socket.on("send-message", ({ roomId, message }) => {
      io.to(roomId).emit("receive-message", {
        sender: socket.id,
        message,
      });
    });

    // ICE / WebRTC passthrough (important for multi-user stability)
    socket.on("offer", (data) => {
      socket.to(data.to).emit("offer", {
        offer: data.offer,
        from: socket.id,
      });
    });

    socket.on("answer", (data) => {
      socket.to(data.to).emit("answer", {
        answer: data.answer,
        from: socket.id,
      });
    });

    socket.on("ice-candidate", (data) => {
      socket.to(data.to).emit("ice-candidate", {
        candidate: data.candidate,
        from: socket.id,
      });
    });

    // LEAVE ROOM
    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user-disconnected", socket.id);
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};