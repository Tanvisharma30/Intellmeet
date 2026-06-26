const rooms = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // JOIN ROOM
    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      if (!rooms[roomId]) rooms[roomId] = new Set();

      rooms[roomId].add(socket.id);

      io.to(roomId).emit("room-users", Array.from(rooms[roomId]));

      socket.to(roomId).emit("user-connected", socket.id);
    });

    // CHAT
    socket.on("send-message", ({ roomId, message, sender }) => {
      io.to(roomId).emit("receive-message", {
        sender,
        message,
      });
    });

    // TYPING
    socket.on("typing", ({ roomId, name }) => {
      socket.to(roomId).emit("user-typing", name);
    });

    // LEAVE
    socket.on("leave-room", (roomId) => {
      if (rooms[roomId]) {
        rooms[roomId].delete(socket.id);

        io.to(roomId).emit("room-users", Array.from(rooms[roomId]));
        socket.to(roomId).emit("user-disconnected", socket.id);
      }

      socket.leave(roomId);
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        if (rooms[roomId].has(socket.id)) {
          rooms[roomId].delete(socket.id);

          io.to(roomId).emit("room-users", Array.from(rooms[roomId]));
          socket.to(roomId).emit("user-disconnected", socket.id);
        }
      }
    });
  });
};