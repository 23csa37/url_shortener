-- Seed Data for URL Shortener Platform
-- Clear existing data if necessary (order respects foreign key constraints)
TRUNCATE TABLE visits, urls, users RESTART IDENTITY CASCADE;

-- Insert Users
-- Password for all seed users is: password123
-- Hashed using bcrypt with 10 rounds: $2a$10$ufisEgnfqB5XNh724TEHPuj4Wc6xKmI470uW3K4J0.uOW4agZiOgy
INSERT INTO users (name, email, password, role, created_at) VALUES
('Platform Admin', 'admin@url.com', '$2a$10$ufisEgnfqB5XNh724TEHPuj4Wc6xKmI470uW3K4J0.uOW4agZiOgy', 'ADMIN', CURRENT_TIMESTAMP - INTERVAL '30 days'),
('John Doe', 'john@url.com', '$2a$10$ufisEgnfqB5XNh724TEHPuj4Wc6xKmI470uW3K4J0.uOW4agZiOgy', 'USER', CURRENT_TIMESTAMP - INTERVAL '15 days'),
('Jane Smith', 'jane@url.com', '$2a$10$ufisEgnfqB5XNh724TEHPuj4Wc6xKmI470uW3K4J0.uOW4agZiOgy', 'USER', CURRENT_TIMESTAMP - INTERVAL '10 days');

-- Insert URLs
-- user_id 1 is admin, user_id 2 is John, user_id 3 is Jane
INSERT INTO urls (user_id, original_url, short_code, custom_alias, qr_code, expires_at, click_count, created_at) VALUES
-- Admin URLs
(1, 'https://github.com/expressjs/express', 'expgh', 'express-github', null, null, 4, CURRENT_TIMESTAMP - INTERVAL '20 days'),
(1, 'https://postgresql.org', 'psqlorg', 'postgres-docs', null, null, 2, CURRENT_TIMESTAMP - INTERVAL '10 days'),
-- John's URLs
(2, 'https://react.dev/reference/react', 'reactref', 'react-docs', null, null, 3, CURRENT_TIMESTAMP - INTERVAL '8 days'),
(2, 'https://tailwindcss.com/docs', 'tailwind', 'tailwind-docs', null, CURRENT_TIMESTAMP + INTERVAL '10 days', 1, CURRENT_TIMESTAMP - INTERVAL '5 days'),
-- Jane's URLs
(3, 'https://socket.io/docs/v4', 'socketio', null, null, CURRENT_TIMESTAMP - INTERVAL '1 day', 0, CURRENT_TIMESTAMP - INTERVAL '4 days'); -- Expired URL

-- Insert Visits for URL stats and trends
-- URL 1 (expgh) visits - total 4
INSERT INTO visits (url_id, visited_at, ip_address, browser, device_type, user_agent) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '18 days', '192.168.1.10', 'Chrome', 'Desktop', 'Mozilla/5.0 Windows NT 10.0; Chrome/115.0.0.0'),
(1, CURRENT_TIMESTAMP - INTERVAL '15 days', '192.168.1.11', 'Safari', 'Mobile', 'Mozilla/5.0 iPhone; CPU iPhone OS 16_5 like Mac OS X; Safari'),
(1, CURRENT_TIMESTAMP - INTERVAL '10 days', '192.168.1.12', 'Firefox', 'Desktop', 'Mozilla/5.0 Linux x86_64; rv:109.0 Firefox/115.0'),
(1, CURRENT_TIMESTAMP - INTERVAL '2 days', '192.168.1.13', 'Chrome', 'Tablet', 'Mozilla/5.0 iPad; CPU OS 16_5 like Mac OS X; Chrome');

-- URL 2 (psqlorg) visits - total 2
INSERT INTO visits (url_id, visited_at, ip_address, browser, device_type, user_agent) VALUES
(2, CURRENT_TIMESTAMP - INTERVAL '7 days', '192.168.2.1', 'Chrome', 'Desktop', 'Mozilla/5.0 Windows NT 10.0; Chrome/115.0.0.0'),
(2, CURRENT_TIMESTAMP - INTERVAL '5 days', '192.168.2.2', 'Edge', 'Desktop', 'Mozilla/5.0 Windows NT 10.0; Edge/115.0.0.0');

-- URL 3 (reactref) visits - total 3
INSERT INTO visits (url_id, visited_at, ip_address, browser, device_type, user_agent) VALUES
(3, CURRENT_TIMESTAMP - INTERVAL '6 days', '192.168.3.1', 'Chrome', 'Desktop', 'Mozilla/5.0 Windows NT 10.0; Chrome/115.0.0.0'),
(3, CURRENT_TIMESTAMP - INTERVAL '4 days', '192.168.3.2', 'Safari', 'Mobile', 'Mozilla/5.0 iPhone; CPU iPhone OS 16_5 like Mac OS X; Safari'),
(3, CURRENT_TIMESTAMP - INTERVAL '1 day', '192.168.3.3', 'Chrome', 'Mobile', 'Mozilla/5.0 Android 13; Chrome/115.0.0.0');

-- URL 4 (tailwind) visits - total 1
INSERT INTO visits (url_id, visited_at, ip_address, browser, device_type, user_agent) VALUES
(4, CURRENT_TIMESTAMP - INTERVAL '2 days', '192.168.3.4', 'Firefox', 'Desktop', 'Mozilla/5.0 Windows NT 10.0; rv:109.0 Firefox/115.0');
