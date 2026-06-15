const authService = require('../services/authService');

/**
 * Handle user signup
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const data = await authService.signup({ name, email, password });
    
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      ...data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle user login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      ...data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle fetching current profile details
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await authService.getProfile(userId);
    
    return res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  getProfile
};
