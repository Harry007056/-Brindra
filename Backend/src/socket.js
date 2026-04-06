function configureSocket(io) {
  io.on('connection', (socket) => {
    socket.on('join_user', (userId) => {
      if (!userId) return;
      socket.join(`user:${String(userId)}`);
    });

    socket.on('leave_user', (userId) => {
      if (!userId) return;
      socket.leave(`user:${String(userId)}`);
    });

    socket.on('join_project', (projectId) => {
      if (!projectId) return;
      socket.join(`project:${String(projectId)}`);
    });

    socket.on('leave_project', (projectId) => {
      if (!projectId) return;
      socket.leave(`project:${String(projectId)}`);
    });

    socket.on('project_typing', (payload) => {
      if (!payload?.projectId) return;
      socket.to(`project:${String(payload.projectId)}`).emit('project_typing', payload);
    });

    socket.on('direct_typing', (payload) => {
      if (!payload?.receiverId) return;
      socket.to(`user:${String(payload.receiverId)}`).emit('direct_typing', payload);
    });
  });
}

module.exports = configureSocket;
