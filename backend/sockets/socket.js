module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // JOIN ROOM
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);

      socket.to(roomId).emit("user-connected", socket.id);
    });

    // CHAT MESSAGE
    socket.on("send-message", ({ roomId, message }) => {
      socket.to(roomId).emit("receive-message", {
        sender: socket.id,
        message,
      });
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};