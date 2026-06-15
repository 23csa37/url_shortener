# Database Design - URL Shortener Platform

This document describes the schema design, tables, relationships, constraints, and indexes of the PostgreSQL database for the URL Shortener Platform.

## Database Name
`url_shortener`

---

## Entity-Relationship Diagram (Mental Model)

```
  ┌───────────┐           ┌───────────┐           ┌───────────┐
  │   users   │1         *│   urls    │1         *│  visits   │
  │  (Users)  ├──────────►│  (Links)  ├──────────►│(Analytics)│
  └───────────┘           └───────────┘           └───────────┘
```

- **Users to URLs (`1` to `Many`)**: A user can register multiple short URLs. If a user is deleted, all their associated short URLs are automatically deleted (`ON DELETE CASCADE`).
- **URLs to Visits (`1` to `Many`)**: A short URL can collect multiple click records. If a URL is deleted, all visit analytics are cleaned up (`ON DELETE CASCADE`).

---

## Table Structure

### 1. `users` Table
Stores registered platform users (both normal users and administrators).

| Column Name  | Data Type     | Constraints                              | Description                                         |
| :----------- | :------------ | :--------------------------------------- | :-------------------------------------------------- |
| `id`         | `SERIAL`      | `PRIMARY KEY`                            | Auto-incrementing identifier                        |
| `name`       | `VARCHAR(100)`| `NOT NULL`                               | User's full display name                            |
| `email`      | `VARCHAR(255)`| `UNIQUE`, `NOT NULL`                     | Unique email used for authentication                |
| `password`   | `VARCHAR(255)`| `NOT NULL`                               | Hashed password (Bcrypt)                            |
| `role`       | `VARCHAR(20)` | `DEFAULT 'USER'`                         | Access role: `USER` or `ADMIN`                      |
| `created_at` | `TIMESTAMP`   | `DEFAULT CURRENT_TIMESTAMP`              | Date and time the account was registered            |

### 2. `urls` Table
Stores information about shortened links.

| Column Name    | Data Type     | Constraints                              | Description                                         |
| :------------- | :------------ | :--------------------------------------- | :-------------------------------------------------- |
| `id`           | `SERIAL`      | `PRIMARY KEY`                            | Auto-incrementing identifier                        |
| `user_id`      | `INTEGER`     | `REFERENCES users(id) ON DELETE CASCADE`  | Owner of the link. NULL indicates guest link.       |
| `original_url` | `TEXT`        | `NOT NULL`                               | The destination URL where users will be redirected  |
| `short_code`   | `VARCHAR(50)` | `UNIQUE`, `NOT NULL`                     | The alphanumeric code identifying the short link    |
| `custom_alias` | `VARCHAR(100)`| `UNIQUE`                                 | Optional custom path chosen by the user             |
| `qr_code`      | `TEXT`        | -                                        | Base64 encoded Data URI of the QR Code image        |
| `expires_at`   | `TIMESTAMP`   | -                                        | Optional date/time when this link becomes invalid   |
| `click_count`  | `INTEGER`     | `DEFAULT 0`                              | Cached click counter for simple dashboard queries   |
| `created_at`   | `TIMESTAMP`   | `DEFAULT CURRENT_TIMESTAMP`              | Date and time the short URL was created             |

### 3. `visits` Table
Stores click tracking and visitor data for every redirection.

| Column Name   | Data Type     | Constraints                              | Description                                         |
| :------------ | :------------ | :--------------------------------------- | :-------------------------------------------------- |
| `id`          | `SERIAL`      | `PRIMARY KEY`                            | Auto-incrementing identifier                        |
| `url_id`      | `INTEGER`     | `REFERENCES urls(id) ON DELETE CASCADE`  | Link associated with this visit                     |
| `visited_at`  | `TIMESTAMP`   | `DEFAULT CURRENT_TIMESTAMP`              | Date and time of click                              |
| `ip_address`  | `VARCHAR(100)`| -                                        | Anonymized or raw IP address of the client          |
| `browser`     | `VARCHAR(100)`| -                                        | Browser name (Chrome, Safari, Firefox, Edge, etc.)  |
| `device_type` | `VARCHAR(100)`| -                                        | Device classification (Desktop, Mobile, Tablet)     |
| `user_agent`  | `TEXT`        | -                                        | Raw HTTP user-agent header string                   |

---

## Indexing Strategy

To keep the platform fast and responsive under load, the following indices are created:

1. **`idx_urls_short_code`** on `urls(short_code)`
   - **Type**: B-Tree
   - **Purpose**: Essential for high-speed URL resolution. Every single redirection queries the `urls` table by `short_code`.
2. **`idx_urls_user_id`** on `urls(user_id)`
   - **Type**: B-Tree
   - **Purpose**: Optimizes user dashboard performance, enabling rapid retrieval of all URLs owned by a specific authenticated user.
3. **`idx_visits_url_id`** on `visits(url_id)`
   - **Type**: B-Tree
   - **Purpose**: Speeds up statistics generation and trend queries for a specific short link.
4. **`idx_visits_visited_at`** on `visits(visited_at)`
   - **Type**: B-Tree
   - **Purpose**: Optimizes daily trend aggregations (e.g. daily click counts) and allows filtering stats by custom date ranges.
