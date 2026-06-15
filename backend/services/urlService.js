const db = require('../config/db');
const generateShortCode = require('../utils/generateShortCode');
const generateQRCode = require('../utils/generateQRCode');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * Helper to check if a code/alias is already taken
 */
const isCodeTaken = async (code) => {
  const result = await db.query(
    'SELECT id FROM urls WHERE short_code = $1 OR custom_alias = $1',
    [code]
  );
  return result.rows.length > 0;
};

/**
 * Create a new short URL
 */
const createUrl = async ({ originalUrl, customAlias, expiresAt, userId, baseUrl }) => {
  let shortCode;

  if (customAlias) {
    // Check if custom alias is already taken
    const taken = await isCodeTaken(customAlias);
    if (taken) {
      throw new AppError('Alias already taken', 400);
    }
    shortCode = customAlias;
  } else {
    // Generate unique short code with collision check retries
    let attempts = 0;
    while (attempts < 5) {
      shortCode = generateShortCode(6);
      const taken = await isCodeTaken(shortCode);
      if (!taken) break;
      attempts++;
    }
    if (attempts === 5) {
      throw new AppError('Database operation failed', 500);
    }
  }

  // Construct absolute redirect URL to put in QR Code
  const redirectUrl = `${baseUrl}/${shortCode}`;
  
  // Generate QR Code base64 Data URI
  const qrCodeDataUri = await generateQRCode(redirectUrl);

  // Parse expiresAt value
  const expiry = expiresAt ? new Date(expiresAt) : null;

  // Insert into DB
  const result = await db.query(
    `INSERT INTO urls (user_id, original_url, short_code, custom_alias, qr_code, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, user_id, original_url, short_code, custom_alias, qr_code, expires_at, click_count, created_at`,
    [userId, originalUrl, shortCode, customAlias || null, qrCodeDataUri, expiry]
  );

  return result.rows[0];
};

/**
 * Get all URLs owned by a specific user
 */
const getUserUrls = async (userId) => {
  const result = await db.query(
    `SELECT id, original_url, short_code, custom_alias, qr_code, expires_at, click_count, created_at
     FROM urls
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

/**
 * Check if the user is owner or an admin
 */
const validateOwnership = async (urlId, userId, userRole) => {
  const result = await db.query('SELECT user_id FROM urls WHERE id = $1', [urlId]);
  
  if (result.rows.length === 0) {
    throw new AppError('Short URL not found', 404);
  }

  const ownerId = result.rows[0].user_id;

  // Admin bypasses ownership checks. Regular user must match URL owner ID.
  if (userRole !== 'ADMIN' && ownerId !== userId) {
    throw new AppError('Unauthorized access', 403);
  }

  return true;
};

/**
 * Update short URL original destination or expiration
 */
const updateUrl = async (urlId, { originalUrl, expiresAt }, userId, userRole) => {
  // Check ownership
  await validateOwnership(urlId, userId, userRole);

  const expiry = expiresAt ? new Date(expiresAt) : null;

  const result = await db.query(
    `UPDATE urls
     SET original_url = $1, expires_at = $2
     WHERE id = $3
     RETURNING id, original_url, short_code, custom_alias, expires_at, click_count`,
    [originalUrl, expiry, urlId]
  );

  return result.rows[0];
};

/**
 * Delete a short URL
 */
const deleteUrl = async (urlId, userId, userRole) => {
  // Check ownership
  await validateOwnership(urlId, userId, userRole);

  await db.query('DELETE FROM urls WHERE id = $1', [urlId]);
  return true;
};

module.exports = {
  createUrl,
  getUserUrls,
  updateUrl,
  deleteUrl,
  validateOwnership
};
