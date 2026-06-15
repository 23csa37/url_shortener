const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all analytics endpoints
router.use(authMiddleware);

// Get URL Statistics
router.get('/:urlId', analyticsController.getUrlStats);

// Get Daily Click Trends
router.get('/trends/:urlId', analyticsController.getUrlTrends);

module.exports = router;
