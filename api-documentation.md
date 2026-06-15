# API Documentation - URL Shortener Platform

This document describes all API endpoints exposed by the Node.js Express server.

## Base URL
```
http://localhost:5000
```

---

## Authentication Endpoints

### 1. User Registration
Creates a new user account (defaults to `USER` role).

* **URL**: `/api/auth/signup`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 4,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER"
    }
  }
  ```

---

### 2. User Login
Authenticates an existing user and returns a JWT token.

* **URL**: `/api/auth/login`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 4,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER"
    }
  }
  ```

---

### 3. Get User Profile
Returns currently logged-in user profile metrics.

* **URL**: `/api/auth/profile`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": 4,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER",
      "created_at": "2026-06-15T09:00:00.000Z"
    }
  }
  ```

---

## URL Management Endpoints

All endpoints below require a valid Authorization header.

### 1. Create Short URL
Shortens a URL, optionally generating a custom alias or custom expiry date.

* **URL**: `/api/urls`
* **Method**: `POST`
* **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "originalUrl": "https://www.google.com/search?q=nodejs",
    "customAlias": "nodequery",
    "expiresAt": "2026-08-30T12:00:00.000Z"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "URL shortened successfully",
    "data": {
      "id": 12,
      "user_id": 4,
      "original_url": "https://www.google.com/search?q=nodejs",
      "short_code": "xH9fk2",
      "custom_alias": "nodequery",
      "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
      "expires_at": "2026-08-30T12:00:00.000Z",
      "click_count": 0,
      "created_at": "2026-06-15T10:15:00.000Z"
    }
  }
  ```

---

### 2. Get User URLs
Retrieves all URLs created by the authenticated user.

* **URL**: `/api/urls`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 12,
        "original_url": "https://www.google.com/search?q=nodejs",
        "short_code": "xH9fk2",
        "custom_alias": "nodequery",
        "qr_code": "data:image/png;base64,...",
        "expires_at": "2026-08-30T12:00:00.000Z",
        "click_count": 5,
        "created_at": "2026-06-15T10:15:00.000Z"
      }
    ]
  }
  ```

---

### 3. Update Short URL
Edits the original destination URL or configuration (e.g. expiry date) of a short link.

* **URL**: `/api/urls/:id`
* **Method**: `PUT`
* **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "originalUrl": "https://www.google.com/search?q=expressjs",
    "expiresAt": "2026-09-30T12:00:00.000Z"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "URL updated successfully",
    "data": {
      "id": 12,
      "original_url": "https://www.google.com/search?q=expressjs",
      "short_code": "xH9fk2",
      "custom_alias": "nodequery",
      "expires_at": "2026-09-30T12:00:00.000Z",
      "click_count": 5
    }
  }
  ```

---

### 4. Delete Short URL
Deletes a short URL. Normal users can only delete their own URLs. Admins can delete any URL.

* **URL**: `/api/urls/:id`
* **Method**: `DELETE`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "URL deleted successfully"
  }
  ```

---

## Analytics Endpoints

### 1. Get URL Statistics
Retrieves metrics for a specific URL, including total click counts and browser/device breakdowns.

* **URL**: `/api/analytics/:urlId`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 12,
      "original_url": "https://www.google.com/search?q=expressjs",
      "short_code": "xH9fk2",
      "click_count": 5,
      "created_at": "2026-06-15T10:15:00.000Z",
      "last_visited": "2026-06-15T10:18:00.000Z",
      "recent_visits": [
        {
          "visited_at": "2026-06-15T10:18:00.000Z",
          "ip_address": "192.168.1.5",
          "browser": "Chrome",
          "device_type": "Desktop"
        }
      ],
      "browsers": [
        { "browser": "Chrome", "count": "3" },
        { "browser": "Safari", "count": "2" }
      ],
      "devices": [
        { "device_type": "Desktop", "count": "3" },
        { "device_type": "Mobile", "count": "2" }
      ]
    }
  }
  ```

---

### 2. Get URL Click Trends
Retrieves daily click counts aggregated using database queries.

* **URL**: `/api/analytics/trends/:urlId`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      { "date": "2026-06-14", "count": "2" },
      { "date": "2026-06-15", "count": "3" }
    ]
  }
  ```

---

## Admin Endpoints

All admin endpoints require `Authorization` header and the user role must be `ADMIN`.

### 1. Get Platform Statistics
Overview statistics of the entire deployment.

* **URL**: `/api/admin/stats`
* **Method**: `GET`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "totalUsers": 15,
      "totalUrls": 124,
      "totalClicks": 1256,
      "activeUrls": 118,
      "expiredUrls": 6
    }
  }
  ```

---

### 2. Get All Users
Returns all users in the system.

* **URL**: `/api/admin/users`
* **Method**: `GET`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Platform Admin",
        "email": "admin@url.com",
        "role": "ADMIN",
        "url_count": 12,
        "created_at": "2026-05-15T10:00:00.000Z"
      }
    ]
  }
  ```

---

### 3. Get All URLs
Returns all shortened links.

* **URL**: `/api/admin/urls`
* **Method**: `GET`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 12,
        "owner_name": "John Doe",
        "original_url": "https://react.dev",
        "short_code": "reactref",
        "click_count": 4,
        "created_at": "2026-06-07T10:00:00.000Z"
      }
    ]
  }
  ```

---

### 4. Live Activity & Top/Active Performance
Aggregated insights of top URLs, active users, and system live click feed.

* **URL**: `/api/admin/insights`
* **Method**: `GET`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "topUrls": [
        { "id": 1, "short_code": "expgh", "original_url": "...", "click_count": 450 }
      ],
      "activeUsers": [
        { "id": 2, "name": "John Doe", "email": "john@url.com", "url_count": 32 }
      ],
      "liveFeed": [
        {
          "visited_at": "2026-06-15T10:19:12.000Z",
          "short_code": "expgh",
          "ip_address": "127.0.0.1",
          "browser": "Chrome",
          "device_type": "Desktop"
        }
      ]
    }
  }
  ```

---

## Redirection Flow

### Redirect Short Code
Performs the redirection, logs visitor telemetry, fires live websocket feeds, and performs a 302 redirect.

* **URL**: `/:shortCode`
* **Method**: `GET`
* **Success Response (302 Found)**:
  * Redirects browser to original URL.
* **Error Response (404 Not Found)**:
  * Redirects to the frontend 404 page or returns JSON depending on Accept headers.
  ```json
  {
    "success": false,
    "message": "Short URL not found"
  }
  ```
