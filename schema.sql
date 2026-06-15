-- Database Schema for URL Shortener Platform
-- Database Name: url_shortener

-- Enable UUID extension if needed (optional, using serial ids as requested)

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create URLs Table
CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    original_url TEXT NOT NULL,
    short_code VARCHAR(50) UNIQUE NOT NULL,
    custom_alias VARCHAR(100) UNIQUE,
    qr_code TEXT, -- Stores base64 encoded QR Code data URI
    expires_at TIMESTAMP,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Visits Table for detailed Analytics
CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY,
    url_id INTEGER REFERENCES urls(id) ON DELETE CASCADE,
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(100),
    browser VARCHAR(100),
    device_type VARCHAR(100),
    user_agent TEXT
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_user_id ON urls(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_url_id ON visits(url_id);
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at);
