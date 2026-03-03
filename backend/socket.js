const { Server } = require("socket.io");

let io = null;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: [/^https?:\/\/localhost(:\d+)?$/i, /^https?:\/\/127\.0\.0\.1(:\d+)?$/i],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join_project", (projectId) => {
      if (!projectId) return;
      socket.join(`project:${String(projectId)}`);
    });

    socket.on("leave_project", (projectId) => {
      if (!projectId) return;
      socket.leave(`project:${String(projectId)}`);
    });

    socket.on("join_user", (userId) => {
      if (!userId) return;
      socket.join(`user:${String(userId)}`);
    });

    socket.on("leave_user", (userId) => {
      if (!userId) return;
      socket.leave(`user:${String(userId)}`);
    });

    socket.on("project_typing", (payload = {}) => {
      const projectId = payload.projectId ? String(payload.projectId) : "";
      const userId = payload.userId ? String(payload.userId) : "";
      const userName = payload.userName ? String(payload.userName) : "";
      const isTyping = Boolean(payload.isTyping);

      if (!projectId || !userId || !userName) return;

      socket.to(`project:${projectId}`).emit("project_typing", {
        projectId,
        userId,
        userName,
        isTyping,
      });
    });

    socket.on("direct_typing", (payload = {}) => {
      const senderId = payload.senderId ? String(payload.senderId) : "";
      const receiverId = payload.receiverId ? String(payload.receiverId) : "";
      const senderName = payload.senderName ? String(payload.senderName) : "";
      const isTyping = Boolean(payload.isTyping);

      if (!senderId || !receiverId || !senderName) return;

      io.to(`user:${receiverId}`).emit("direct_typing", {
        senderId,
        receiverId,
        senderName,
        isTyping,
      });
    });
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = {
  initSocket,
  getIO,
};
