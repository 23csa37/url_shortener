# ZipLink | Premium SaaS URL Shortener & Real-Time Analytics Platform

ZipLink is a complete, production-ready, full-stack SaaS URL Shortener Platform built using React.js (Vite + Tailwind CSS) and Node.js (Express + PostgreSQL + Socket.IO). It provides quick shortening services, custom alias routing, pixel-perfect download-ready QR codes, and websocket-based live activity mapping.

---

## 1. Project Overview

ZipLink is designed to provide high-performance, secure redirection, combined with rich, real-time analytics. It features a complete Role-Based Access Control (RBAC) mechanism distinguishing standard `USER` accounts from system `ADMIN` roles.

---

## 2. Features

### User Capabilities:
- **Register & Secure Login**: Fast, secure session controls.
- **Shorten URLs**: Quickly generate base62 shortcodes.
- **Custom Aliases**: Claim custom alias subpaths for promotions.
- **QR Code Generation**: Download and share QR images.
- **Expiration Control**: Define automatic link expiration dates.
- **Link Analytics**: Visual metrics including clicks totals, daily click trends (Line Charts), browser shares, and device splits.
- **Management Console**: Edit destinations, copy short URLs, or delete own links.

### Admin Capabilities:
- **Platform Analytics**: Global totals counters (Users, URLs, Clicks, Expirations).
- **Live Monitoring**: Stream live click redirection feeds in real-time.
- **User Directory**: View registered accounts and URL counts.
- **Link Directories**: Inspect and delete any link across the system.
- **Performance Analytics**: Spot top-performing links and active users.

---

## 3. Folder Structure

```
url_project/
├── backend/
│   ├── config/
│   │   └── db.js                  # PostgreSQL pg Pool Client configuration
│   ├── controllers/
│   │   ├── adminController.js     # Admin metrics & insights
│   │   ├── analyticsController.js # URL stats & trends
│   │   ├── authController.js      # Signup, login & profile details
│   │   ├── redirectController.js  # Low-latency redirection & logging
│   │   └── urlController.js       # Shortlink CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT Session guard
│   │   ├── errorMiddleware.js     # Global error formatter
│   │   ├── requestLogger.js       # HTTP request auditor
│   │   ├── roleMiddleware.js      # Admin RBAC check
│   │   └── validationMiddleware.js# express-validator error catcher
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── redirectRoutes.js
│   │   └── urlRoutes.js
│   ├── services/
│   │   ├── adminService.js
│   │   ├── analyticsService.js
│   │   ├── authService.js
│   │   └── urlService.js
│   ├── sockets/
│   │   └── analyticsSocket.js     # Socket.IO WebSocket handlers
│   ├── utils/
│   │   ├── generateQRCode.js      # qrcode QR compiler
│   │   ├── generateShortCode.js   # base62 alphanumeric string generator
│   │   ├── parseBrowser.js        # User-Agent browser parser
│   │   └── parseDevice.js         # User-Agent device parser
│   ├── validators/
│   │   ├── authValidator.js
│   │   └── urlValidator.js
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── server.js                  # Server entry script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Modal.jsx          # Custom popup modal dialog
│   │   │   ├── Navbar.jsx         # Marketing navigation header
│   │   │   ├── Sidebar.jsx        # Dashboard sliding navigation drawer
│   │   │   └── Skeleton.jsx       # Custom skeleton pulse placeholders
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # React Session manager
│   │   │   └── ThemeContext.jsx   # Dark/Light selector
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx       # 404 page
│   │   │   ├── Profile.jsx
│   │   │   ├── PublicStatsPage.jsx# Anonymous link details page
│   │   │   ├── Signup.jsx
│   │   │   ├── UrlManagement.jsx  # Admin link indexer
│   │   │   └── UserManagement.jsx # Admin user indexer
│   │   ├── services/
│   │   │   ├── api.js             # Axios client configuration
│   │   │   └── socket.js          # Socket.IO client interface
│   │   ├── App.jsx                # Router config
│   │   ├── index.css              # Custom styling definitions
│   │   └── main.jsx               # React DOM mount
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── api-documentation.md           # API Specifications
├── architecture.md                # System Architecture & Flows
├── database-design.md             # PostgreSQL Entities & Relationships
├── schema.sql                     # SQL Table Schemas
└── seed.sql                       # SQL Seeding Script
```

---

## 4. Database Design

ZipLink runs on a PostgreSQL database containing three tables:
- **`users`**: Registers accounts. Keeps username, email, passwords (hashed), role (`USER` or `ADMIN`).
- **`urls`**: Stores shortened targets, shortcodes, custom aliases, QR base64 data, expiration timestamps, and cached redirect metrics.
- **`visits`**: Captures visitor browser, device type, ip address, agent headers, and click timestamps.

Refer to [database-design.md](file:///c:/Users/arulp/OneDrive/Desktop/url_project/database-design.md) for more details.

---

## 5. PostgreSQL Setup

1. Open your PostgreSQL terminal (pgAdmin, psql CLI).
2. Create database `url_shortener`:
   ```sql
   CREATE DATABASE url_shortener;
   ```
3. Connect to the database:
   ```bash
   \c url_shortener
   ```
4. Load the database schema:
   ```bash
   \i schema.sql
   ```
5. Seed initial test data:
   ```bash
   \i seed.sql
   ```

---

## 6. Environment Variables

Configure environment variables in `/backend/.env`.

```ini
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root@123
DB_NAME=url_shortener

PORT=5000

JWT_SECRET=super_secret_jwt_sign_key_987654321
```

---

## 7. Backend Setup

1. Open terminal and enter `/backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The backend will launch at [http://localhost:5000](http://localhost:5000).

---

## 8. Frontend Setup

1. Open terminal and enter `/frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
   The frontend will launch at [http://localhost:5173](http://localhost:5173).

---

## 9. API Documentation

Detailed endpoints definitions, formats, request schemas, and responses are located in [api-documentation.md](file:///c:/Users/arulp/OneDrive/Desktop/url_project/api-documentation.md).

---

## 10. Running The Project

To start the platform, run both servers concurrently:
- Start PostgreSQL and seed the schema.
- Start backend: `npm run dev` in `/backend`
- Start frontend: `npm run dev` in `/frontend`

Open browser to `http://localhost:5173` to test.

---

## 11. Common Errors And Fixes

### ❌ PostgreSQL Authentication Failure
- **Error message**: `FATAL: password authentication failed for user "postgres"`
- **Fix**: Check `DB_PASSWORD` and `DB_USER` in `/backend/.env`. Ensure they match your local PostgreSQL server configuration.

### ❌ Database Not Found
- **Error message**: `FATAL: database "url_shortener" does not exist`
- **Fix**: Connect to your database server and execute `CREATE DATABASE url_shortener;` before running backend commands.

### ❌ Port Already In Use
- **Error message**: `Error: listen EADDRINUSE: address already in use :::5000`
- **Fix**: Find and kill the process occupying port 5000, or modify `PORT` parameter in `/backend/.env` (and update backend URLs in `/frontend/src/services/api.js` and `socket.js` to match).

### ❌ JWT Secret Missing
- **Error message**: `jwt secret signature must be provided`
- **Fix**: Ensure `JWT_SECRET` is defined in `/backend/.env` and your backend console prints connection success flags.

### ❌ Invalid URL
- **Error message**: `{ "success": false, "message": "Please enter a valid URL" }`
- **Fix**: Ensure target URL includes TLD and protocols (e.g. `https://google.com` instead of `google`).

### ❌ Invalid Email
- **Error message**: `{ "success": false, "message": "Please enter a valid email address" }`
- **Fix**: Input email string must contain proper name and domain syntax (e.g., `user@domain.com`).

### ❌ Socket.IO Connection Issues
- **Problem**: Real-time click dashboards do not update.
- **Fix**: Ensure backend CORS allows client requests. Check if browser console logs socket connection success status: `⚡ Socket connected to server`.

---

## 12. Deployment Guide

### Backend:
1. Provision a PostgreSQL instance (Render DB, AWS RDS, Supabase).
2. Configure credentials inside production host environment settings.
3. Deploy Node server. Set start scripts commands to `node server.js`.

### Frontend:
1. Update API client connection host from `localhost:5000` to your production backend URL.
2. Run build script:
   ```bash
   npm run build
   ```
3. Upload outputs folder `dist` to static host channels (Vercel, Netlify, AWS S3).

---

## 13. AI Planning Document

Refer to [implementation_plan.md](file:///C:/Users/arulp/.gemini/antigravity-ide/brain/f9ec9ed0-a6c4-430c-bcc2-d1156e4644fa/implementation_plan.md) and [task.md](file:///C:/Users/arulp/.gemini/antigravity-ide/brain/f9ec9ed0-a6c4-430c-bcc2-d1156e4644fa/task.md) for details on planning, scopes, goals, checklists, and execution logs.

---

## 14. Assumptions
- Local PostgreSQL instance runs on standard port 5432.
- Local host uses port 5000 for backend and port 5173 for Vite dev server.
- The standard browser window supports HTML5 Canvas and base64 rendering for QR Codes downloads.
- Admin user seed details (`admin@url.com` / `password123`) can be used for administrative review testing.

---

## 15. Architecture Explanation

For system diagrams and visual dataflows, see [architecture.md](file:///c:/Users/arulp/OneDrive/Desktop/url_project/architecture.md). It outlines the Presentational React layer, Redirection middleware endpoints, and Socket communication channels.

---

## 16. Security Features
- **JWT Authorization**: Enforces session bounds on CRUD and analytics endpoints.
- **Password Hashing**: Securely hashes passwords using `bcryptjs` before storage.
- **Ownership Scopes**: Ensures users cannot access other users' statistics or update destinations.
- **RBAC Guards**: Restricts administration routes (user logs, all URLs list) to validated `ADMIN` roles.

---

## 17. Validation Strategy
We utilize the `express-validator` library on the backend to enforce:
- Required input structures
- Email format validation
- Alphanumeric-only custom alias limits
- Proper destination URL verification containing schemes and TLDs.

---

## 18. Analytics Tracking Flow
1. Visitor requests root shortcode: `GET /:shortCode`.
2. Database lookup runs to resolve target original URL.
3. Expired links are rejected with a 410 response.
4. Active link hits record visitor browser, device type, IP, and timestamp.
5. Telemetry details are logged and broadcast via WebSockets.
6. Server sends `302 Found` response redirecting the client browser.

-------------
Video Demo link: https://youtu.be/T6fuMIPOH2Y
--------------

This project is a part of a hackathon run by https://katomaran.com
