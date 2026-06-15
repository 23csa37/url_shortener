const { body } = require('express-validator');

const createUrlRules = [
  body('originalUrl')
    .trim()
    .notEmpty()
    .withMessage('Please enter a valid URL')
    .isURL({ require_tld: true, require_protocol: true })
    .withMessage('Please enter a valid URL'),
  body('customAlias')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Alias must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9-_]+$/)
    .withMessage('Alias can only contain letters, numbers, hyphens, and underscores'),
  body('expiresAt')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Please enter a valid expiration date')
];

const updateUrlRules = [
  body('originalUrl')
    .trim()
    .notEmpty()
    .withMessage('Please enter a valid URL')
    .isURL({ require_tld: true, require_protocol: true })
    .withMessage('Please enter a valid URL'),
  body('expiresAt')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Please enter a valid expiration date')
];

module.exports = {
  createUrlRules,
  updateUrlRules
};
