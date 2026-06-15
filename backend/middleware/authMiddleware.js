const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists in database
    const userResult = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Attach user information to request
    req.user = userResult.rows[0];
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
};

module.exports = authMiddleware;
