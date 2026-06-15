const db = require('../config/db');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * Fetch detailed metrics for a specific URL
 */
const getUrlStats = async (urlId) => {
  // Get URL detail
  const urlResult = await db.query(
    'SELECT id, original_url, short_code, custom_alias, created_at, click_count FROM urls WHERE id = $1',
    [urlId]
  );
  if (urlResult.rows.length === 0) {
    throw new AppError('Short URL not found', 404);
  }
  const url = urlResult.rows[0];

  // Get Last Visited Time
  const lastVisitedResult = await db.query(
    'SELECT visited_at FROM visits WHERE url_id = $1 ORDER BY visited_at DESC LIMIT 1',
    [urlId]
  );
  const lastVisited = lastVisitedResult.rows.length > 0 ? lastVisitedResult.rows[0].visited_at : null;

  // Get Recent Visits (limit 10)
  const recentVisitsResult = await db.query(
    `SELECT id, visited_at, ip_address, browser, device_type
     FROM visits
     WHERE url_id = $1
     ORDER BY visited_at DESC
     LIMIT 10`,
    [urlId]
  );

  // Aggregated Browser Analytics
  const browserStats = await db.query(
    `SELECT browser, COUNT(id) as count
     FROM visits
     WHERE url_id = $1
     GROUP BY browser
     ORDER BY count DESC`,
    [urlId]
  );

  // Aggregated Device Analytics
  const deviceStats = await db.query(
    `SELECT device_type, COUNT(id) as count
     FROM visits
     WHERE url_id = $1
     GROUP BY device_type
     ORDER BY count DESC`,
    [urlId]
  );

  return {
    id: url.id,
    original_url: url.original_url,
    short_code: url.short_code,
    custom_alias: url.custom_alias,
    click_count: parseInt(url.click_count || '0'),
    created_at: url.created_at,
    last_visited: lastVisited,
    recent_visits: recentVisitsResult.rows,
    browsers: browserStats.rows,
    devices: deviceStats.rows
  };
};

/**
 * Fetch daily click trends aggregated by date for Chart.js representation
 */
const getUrlTrends = async (urlId) => {
  const trendsResult = await db.query(
    `SELECT TO_CHAR(visited_at, 'YYYY-MM-DD') as date, COUNT(id) as count
     FROM visits
     WHERE url_id = $1
     GROUP BY TO_CHAR(visited_at, 'YYYY-MM-DD')
     ORDER BY date ASC`,
    [urlId]
  );
  return trendsResult.rows;
};

module.exports = {
  getUrlStats,
  getUrlTrends
};
