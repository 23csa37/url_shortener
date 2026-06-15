require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Import Config
require('./config/db'); // Runs db pool verification

// Import Middleware
const requestLogger = require('./middleware/requestLogger');
const { errorMiddleware } = require('./middleware/errorMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const redirectRoutes = require('./routes/redirectRoutes');

// Import Sockets
const analyticsSocket = require('./sockets/analyticsSocket');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all client links for the dashboard
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Initialize WebSocket Channels
analyticsSocket.init(io);

// Enable CORS and Express JSON body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply Request Logging Middleware
app.use(requestLogger);

// API Route Mappings
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Root level short URL redirection route (must be last to prevent collision with routes)
app.use('/', redirectRoutes);

// Catch-all route for unhandled requests (404 Page)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Short URL not found'
  });
});

// Centralized Error Handling Middleware (must be after all routes)
app.use(errorMiddleware);

// Start Server listening on process.env.PORT
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running in production mode on http://localhost:${PORT}`);
});
