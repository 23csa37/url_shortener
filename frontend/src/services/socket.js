import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket = null;

/**
 * Initialize Socket connection if it doesn't exist
 */
export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('⚡ Socket connected to server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected from server');
    });
  }
  return socket;
};

/**
 * Get the active socket instance
 */
export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

/**
 * Helper to join a specific room (e.g. user_1 or admin)
 */
export const joinRoom = (roomName) => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  s.emit('join', roomName);
};

/**
 * Helper to leave a room
 */
export const leaveRoom = (roomName) => {
  const s = getSocket();
  if (s.connected) {
    s.emit('leave', roomName);
  }
};

/**
 * Disconnect socket entirely
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
