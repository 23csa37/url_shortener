const express = require('express');
const authController = require('../controllers/authController');
const { signupRules, loginRules } = require('../validators/authValidator');
const validate = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public auth endpoints
router.post('/signup', signupRules, validate, authController.signup);
router.post('/login', loginRules, validate, authController.login);

// Private profile endpoint
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
