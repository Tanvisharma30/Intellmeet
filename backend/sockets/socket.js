module.exports = (io) => {
  const rooms = new Map(); // roomId -> Set(socketIds)

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // JOIN ROOM
    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      rooms.get(roomId).add(socket.id);

      io.to(roomId).emit(
        "room-users",
        Array.from(rooms.get(roomId))
      );
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
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);

        io.to(roomId).emit(
          "room-users",
          Array.from(rooms.get(roomId))
        );
      }

      socket.leave(roomId);
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      for (const [roomId, users] of rooms.entries()) {
        users.delete(socket.id);

        io.to(roomId).emit(
          "room-users",
          Array.from(users)
        );
      }

      console.log("Disconnected:", socket.id);
    });
  });
};