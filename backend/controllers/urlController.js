const urlService = require('../services/urlService');

/**
 * Create a new short URL
 */
const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;
    const userId = req.user.id;

    // Build base URL dynamically
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const data = await urlService.createUrl({
      originalUrl,
      customAlias,
      expiresAt,
      userId,
      baseUrl
    });

    return res.status(201).json({
      success: true,
      message: 'URL shortened successfully',
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch all URLs created by current user
 */
const getUserUrls = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await urlService.getUserUrls(userId);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update a URL
 */
const updateUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { originalUrl, expiresAt } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const data = await urlService.updateUrl(
      parseInt(id),
      { originalUrl, expiresAt },
      userId,
      userRole
    );

    return res.status(200).json({
      success: true,
      message: 'URL updated successfully',
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a URL
 */
const deleteUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    await urlService.deleteUrl(parseInt(id), userId, userRole);

    return res.status(200).json({
      success: true,
      message: 'URL deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUrl,
  getUserUrls,
  updateUrl,
  deleteUrl
};
