module.exports = (io) => {
  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // join room
    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      rooms.get(roomId).add(socket.id);

      io.to(roomId).emit("user-joined", socket.id);
      io.to(roomId).emit("room-users", Array.from(rooms.get(roomId)));
    });

    // 🔥 WebRTC SIGNALING

    socket.on("offer", ({ to, from, offer }) => {
      io.to(to).emit("offer", { from, offer });
    });

    socket.on("answer", ({ to, from, answer }) => {
      io.to(to).emit("answer", { from, answer });
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      io.to(to).emit("ice-candidate", {
        from: socket.id,
        candidate,
      });
    });

    // CHAT (unchanged)
    socket.on("send-message", ({ roomId, message, sender }) => {
      io.to(roomId).emit("receive-message", {
        sender,
        message,
      });
    });

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

    socket.on("disconnect", () => {
      for (const [roomId, users] of rooms.entries()) {
        users.delete(socket.id);
        io.to(roomId).emit("room-users", Array.from(users));
      }
    });
  });
};