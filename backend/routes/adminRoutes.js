const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply authMiddleware and requireAdmin role validation to all admin routes
router.use(authMiddleware);
router.use(requireAdmin);

// Platform stats summary
router.get('/stats', adminController.getPlatformStats);

// List of all registered users
router.get('/users', adminController.getAllUsers);

// List of all generated URLs
router.get('/urls', adminController.getAllUrls);

// Platform insights (top URLs, active users, activity log, overall trends)
router.get('/insights', adminController.getPlatformInsights);

module.exports = router;
