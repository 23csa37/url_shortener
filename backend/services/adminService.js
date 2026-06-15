const db = require('../config/db');

/**
 * Fetch platform stats overview
 */
const getPlatformStats = async () => {
  const usersCountResult = await db.query('SELECT COUNT(*) FROM users');
  const urlsCountResult = await db.query('SELECT COUNT(*) FROM urls');
  const clicksSumResult = await db.query('SELECT COALESCE(SUM(click_count), 0) as total FROM urls');
  const activeCountResult = await db.query(
    'SELECT COUNT(*) FROM urls WHERE expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP'
  );
  const expiredCountResult = await db.query(
    'SELECT COUNT(*) FROM urls WHERE expires_at IS NOT NULL AND expires_at <= CURRENT_TIMESTAMP'
  );

  return {
    totalUsers: parseInt(usersCountResult.rows[0].count),
    totalUrls: parseInt(urlsCountResult.rows[0].count),
    totalClicks: parseInt(clicksSumResult.rows[0].total),
    activeUrls: parseInt(activeCountResult.rows[0].count),
    expiredUrls: parseInt(expiredCountResult.rows[0].count)
  };
};

/**
 * Fetch all registered users with their created URL counts
 */
const getAllUsers = async () => {
  const result = await db.query(
    `SELECT u.id, u.name, u.email, u.role, u.created_at, COUNT(l.id) as url_count
     FROM users u
     LEFT JOIN urls l ON u.id = l.user_id
     GROUP BY u.id, u.name, u.email, u.role, u.created_at
     ORDER BY u.created_at DESC`
  );
  return result.rows;
};

/**
 * Fetch all platform URLs with owner details
 */
const getAllUrls = async () => {
  const result = await db.query(
    `SELECT l.id, l.original_url, l.short_code, l.custom_alias, l.expires_at, l.click_count, l.created_at,
            u.name as owner_name, u.email as owner_email
     FROM urls l
     LEFT JOIN users u ON l.user_id = u.id
     ORDER BY l.created_at DESC`
  );
  return result.rows;
};

/**
 * Fetch insights: Top performing URLs, Most active users, and Live click activities feed
 */
const getPlatformInsights = async () => {
  // Top 10 urls by click count
  const topUrlsResult = await db.query(
    `SELECT l.id, l.short_code, l.original_url, l.click_count, u.name as owner_name
     FROM urls l
     LEFT JOIN users u ON l.user_id = u.id
     WHERE l.click_count > 0
     ORDER BY l.click_count DESC
     LIMIT 10`
  );

  // Top 10 active users by short URL counts
  const activeUsersResult = await db.query(
    `SELECT u.id, u.name, u.email, COUNT(l.id) as url_count
     FROM users u
     JOIN urls l ON u.id = l.user_id
     GROUP BY u.id, u.name, u.email
     ORDER BY url_count DESC
     LIMIT 10`
  );

  // Live 20 activity click entries
  const liveFeedResult = await db.query(
    `SELECT v.id, v.visited_at, v.ip_address, v.browser, v.device_type, l.short_code, l.original_url
     FROM visits v
     JOIN urls l ON v.url_id = l.id
     ORDER BY v.visited_at DESC
     LIMIT 20`
  );

  // Aggregated click trends for last 30 days
  const dailyTrendsResult = await db.query(
    `SELECT TO_CHAR(visited_at, 'YYYY-MM-DD') as date, COUNT(id) as count
     FROM visits
     WHERE visited_at >= CURRENT_DATE - INTERVAL '30 days'
     GROUP BY TO_CHAR(visited_at, 'YYYY-MM-DD')
     ORDER BY date ASC`
  );

  // Platform Device split
  const deviceResult = await db.query(
    `SELECT device_type, COUNT(id) as count
     FROM visits
     GROUP BY device_type
     ORDER BY count DESC`
  );

  // Platform Browser split
  const browserResult = await db.query(
    `SELECT browser, COUNT(id) as count
     FROM visits
     GROUP BY browser
     ORDER BY count DESC`
  );

  return {
    topUrls: topUrlsResult.rows,
    activeUsers: activeUsersResult.rows,
    liveFeed: liveFeedResult.rows,
    dailyTrends: dailyTrendsResult.rows,
    devices: deviceResult.rows,
    browsers: browserResult.rows
  };
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  getAllUrls,
  getPlatformInsights
};
