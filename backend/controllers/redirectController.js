const db = require('../config/db');
const parseBrowser = require('../utils/parseBrowser');
const parseDevice = require('../utils/parseDevice');
const analyticsSocket = require('../sockets/analyticsSocket');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * Handle URL redirection based on shortCode or Custom Alias
 */
const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Look up URL by short_code OR custom_alias
    const result = await db.query(
      'SELECT * FROM urls WHERE short_code = $1 OR custom_alias = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Short URL not found'
      });
    }

    const url = result.rows[0];

    // Check expiration date
    if (url.expires_at && new Date(url.expires_at) < new Date()) {
      return res.status(410).json({
        success: false,
        message: 'Link has expired'
      });
    }

    // Capture visitor details
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    // Clean IPv6 loopback mapping if present
    const ipAddress = rawIp.includes('::ffff:') ? rawIp.split('::ffff:')[1] : rawIp;
    const userAgent = req.headers['user-agent'] || '';
    const browser = parseBrowser(userAgent);
    const deviceType = parseDevice(userAgent);

    // Save analytics (Visits table)
    const visitResult = await db.query(
      `INSERT INTO visits (url_id, ip_address, browser, device_type, user_agent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, visited_at, ip_address, browser, device_type, user_agent`,
      [url.id, ipAddress, browser, deviceType, userAgent]
    );

    const visit = visitResult.rows[0];

    // Increment click_count in urls table
    await db.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE id = $1',
      [url.id]
    );

    // Notify URL owner & admins in real-time
    const wsPayload = {
      id: visit.id,
      url_id: url.id,
      short_code: url.short_code,
      original_url: url.original_url,
      custom_alias: url.custom_alias,
      visited_at: visit.visited_at,
      ip_address: visit.ip_address,
      browser: visit.browser,
      device_type: visit.device_type,
      user_agent: visit.user_agent
    };
    
    analyticsSocket.notifyVisit(url.user_id, wsPayload);

    // Perform HTTP 302 Redirection
    return res.redirect(302, url.original_url);
  } catch (err) {
    next(err);
  }
};

/**
 * Public lookup stats for shortcode
 */
const getPublicStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const result = await db.query(
      'SELECT id, original_url, short_code, custom_alias, created_at, click_count, expires_at FROM urls WHERE short_code = $1 OR custom_alias = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Short URL not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  redirectUrl,
  getPublicStats
};
