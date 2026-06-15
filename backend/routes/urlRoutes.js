const express = require('express');
const urlController = require('../controllers/urlController');
const { createUrlRules, updateUrlRules } = require('../validators/urlValidator');
const validate = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authMiddleware globally to all URL routes
router.use(authMiddleware);

// Create Short URL
router.post('/', createUrlRules, validate, urlController.createUrl);

// Get Current User's URLs
router.get('/', urlController.getUserUrls);

// Update Destination or Expiration details
router.put('/:id', updateUrlRules, validate, urlController.updateUrl);

// Delete Short URL
router.delete('/:id', urlController.deleteUrl);

module.exports = router;
