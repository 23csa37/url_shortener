const express = require('express');
const redirectController = require('../controllers/redirectController');

const router = express.Router();

// Public lookup route (must be defined before catch-all shortcode route)
router.get('/api/public/stats/:shortCode', redirectController.getPublicStats);

// Root level short URL redirection route
router.get('/:shortCode', redirectController.redirectUrl);

module.exports = router;
