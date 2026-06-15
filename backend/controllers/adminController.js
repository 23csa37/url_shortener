const adminService = require('../services/adminService');

/**
 * Get Platform Stats Overview
 */
const getPlatformStats = async (req, res, next) => {
  try {
    const data = await adminService.getPlatformStats();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get All Registered Users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const data = await adminService.getAllUsers();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get All Platform shortened URLs
 */
const getAllUrls = async (req, res, next) => {
  try {
    const data = await adminService.getAllUrls();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Platform Insights (Top URLs, Active Users, Live activity stream)
 */
const getPlatformInsights = async (req, res, next) => {
  try {
    const data = await adminService.getPlatformInsights();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  getAllUrls,
  getPlatformInsights
};
