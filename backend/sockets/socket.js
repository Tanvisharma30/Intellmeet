module.exports = (io) => {
  const rooms = new Map();
  const socketUsers = new Map();

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // join room
    socket.on("join-room", ({ roomId, name }) => {
      socket.join(roomId);

      socketUsers.set(socket.id, name);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, []);
      }

      const users = rooms.get(roomId);

      // ✅ FIX: remove old duplicate entry first
      const updatedUsers = users.filter((u) => u.id !== socket.id);

      updatedUsers.push({
        id: socket.id,
        name: name || "Guest",
      });

      rooms.set(roomId, updatedUsers);

      io.to(roomId).emit("user-joined", socket.id);
      io.to(roomId).emit("room-users", updatedUsers);
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

    // leave room
    socket.on("leave-room", (roomId) => {
      if (rooms.has(roomId)) {
        const users = rooms.get(roomId);

        const updated = users.filter((u) => u.id !== socket.id);

        rooms.set(roomId, updated);

        io.to(roomId).emit("room-users", updated);
      }

      socketUsers.delete(socket.id);
      socket.leave(roomId);
    });

    // disconnect
    socket.on("disconnect", () => {
      socketUsers.delete(socket.id);

      for (const [roomId, users] of rooms.entries()) {
        const updated = users.filter((u) => u.id !== socket.id);

        rooms.set(roomId, updated);

        io.to(roomId).emit("room-users", updated);
      }

      console.log("Disconnected:", socket.id);
    });
  });
};