// Socket.IO Analytics Integration
let ioInstance = null;

/**
 * Initialize Socket.IO instance and define basic listener actions
 * @param {object} io - Socket.IO Server instance
 */
const init = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`⚡ WebSocket client connected: ${socket.id}`);

    // Join specific rooms (e.g. user_1, user_2, or 'admin')
    socket.on('join', (roomName) => {
      socket.join(roomName);
      console.log(`🚪 Client ${socket.id} joined room: ${roomName}`);
    });

    // Handle manual leave events
    socket.on('leave', (roomName) => {
      socket.leave(roomName);
      console.log(`🚪 Client ${socket.id} left room: ${roomName}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 WebSocket client disconnected: ${socket.id}`);
    });
  });
};

/**
 * Emits click analytics details to the specific link owner and admin feeds in real-time
 * @param {number} userId - Owner's user identifier
 * @param {object} visitData - Click telemetry information
 */
const notifyVisit = (userId, visitData) => {
  if (!ioInstance) {
    console.warn('⚠️ Socket.IO instance not initialized yet.');
    return;
  }

  // Log websocket emission for verification
  console.log(`📡 Broadcasting visit event for user_${userId} and admin`);

  // Send to link owner room
  if (userId) {
    ioInstance.to(`user_${userId}`).emit('visit_logged', visitData);
  }

  // Send to admin monitoring panel
  ioInstance.to('admin').emit('visit_logged', visitData);
};

module.exports = {
  init,
  notifyVisit
};
