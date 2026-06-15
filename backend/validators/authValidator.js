const { body } = require('express-validator');

const signupRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Please enter a valid email address')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password must be at least 6 characters')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Please enter a valid email address')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = {
  signupRules,
  loginRules
};
