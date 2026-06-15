const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * Register a new user
 */
const signup = async ({ name, email, password }) => {
  // Check if email already registered
  const userCheck = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (userCheck.rows.length > 0) {
    throw new AppError('Email already registered', 400);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert user
  const result = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, hashedPassword, 'USER']
  );

  const user = result.rows[0];

  // Generate JWT Token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
};

/**
 * Authenticate user credentials
 */
const login = async ({ email, password }) => {
  // Find user by email
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Exclude password from return payload
  delete user.password;

  return { user, token };
};

/**
 * Fetch profile data
 */
const getProfile = async (userId) => {
  const result = await db.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
    [userId]
  );
  if (result.rows.length === 0) {
    throw new AppError('Authentication required', 401);
  }
  return result.rows[0];
};

module.exports = {
  signup,
  login,
  getProfile
};
