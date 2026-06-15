const analyticsService = require('../services/analyticsService');
const urlService = require('../services/urlService');

/**
 * Get metrics for a specific URL
 */
const getUrlStats = async (req, res, next) => {
  try {
    const { urlId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Validate ownership before querying statistics
    await urlService.validateOwnership(parseInt(urlId), userId, userRole);

    const data = await analyticsService.getUrlStats(parseInt(urlId));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get daily click trends for a specific URL
 */
const getUrlTrends = async (req, res, next) => {
  try {
    const { urlId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Validate ownership
    await urlService.validateOwnership(parseInt(urlId), userId, userRole);

    const data = await analyticsService.getUrlTrends(parseInt(urlId));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUrlStats,
  getUrlTrends
};
