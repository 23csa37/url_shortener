const { Pool } = require('pg');
require('dotenv').config();

// Create connection configuration pool using process.env
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Verify connection on startup
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL Connected Successfully');
    return true;
  } catch (err) {
    if (err.code === '28P01' || err.code === '28000') {
      console.error('❌ Invalid PostgreSQL Credentials');
    } else if (err.code === '3D000') {
      console.error('❌ Database Does Not Exist');
    } else {
      console.error('❌ Database Connection Error');
    }
    console.error(`Error details: ${err.message}`);
    return false;
  }
};

testConnection();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
