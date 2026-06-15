# System Architecture - URL Shortener Platform

This document describes the solution design, software architecture, data flows, and technological layers of the URL Shortener Platform.

## High-Level Architecture Diagram

```mermaid
graph TD
    subgraph Client Layer (React.js Frontend)
        UI[Landing / Dashboard / Analytics / Admin]
        AxiosClient[Axios API Client]
        SocketClient[Socket.IO Client]
    end

    subgraph Server Layer (Node.js Express Backend)
        API[Express App / Router]
        SocketServer[Socket.IO WS Server]
        AuthMW[JWT Auth & RBAC Middleware]
        Controllers[API Controllers]
        Services[Business Services]
        Validators[Express Validator]
    end

    subgraph Data Layer
        DB[(PostgreSQL Database)]
    end

    %% Interactions
    UI -->|1. HTTP Actions| AxiosClient
    AxiosClient -->|2. REST Requests| API
    UI -.->|6. Listen for updates| SocketClient
    
    API -->|3. Validate & Authenticate| AuthMW
    AuthMW --> Controllers
    Controllers --> Services
    Services -->|4. Execute SQL Queries| DB
    
    %% Real-time / Redirection loop
    Client_Visitor((Visitor Link Click)) -->|A. GET /:shortCode| API
    API -->|B. Process Redirect| Services
    Services -->|C. Insert Visit & Increment Count| DB
    Services -->|D. Broadcast Analytics Event| SocketServer
    SocketServer -.->|E. Push real-time event| SocketClient
    API -->|F. HTTP 302 Redirection| Client_Visitor
```

---

## Architecture Components

### 1. Presentation Layer (Frontend)
- **Framework**: React.js compiled with **Vite** for high performance.
- **Routing**: React Router DOM (v6) implementing protected layout wrappers to segregate unauthorized users, logged-in users, and platform administrators.
- **Styling**: Tailwind CSS configured with a unified dark/light utility system and glassmorphic aesthetic cards.
- **Animations**: Framer Motion for premium, smooth page transitions, sidebar sliding animations, and modal overlays.
- **Charts**: Chart.js (via `react-chartjs-2`) for daily trends (line chart), and browser/device splits (doughnut charts).
- **Communication**:
  - `Axios` interceptors to attach Authorization tokens and handle session expirations.
  - `socket.io-client` listening to rooms matching specific user IDs or general admin alerts.

### 2. Application Layer (Backend Server)
- **Runtime**: Node.js with Express.js framework.
- **HTTP Routing**: Centralized routing split into logical directories (Auth, URLs, Analytics, Admin, Redirects).
- **Security & Validation**:
  - JWT tokens sent in authorization header.
  - Role-Based Access Control (RBAC) middleware verifying roles (`ADMIN` vs `USER`).
  - Validation middleware using `express-validator` to guarantee payload sanitization before reaching core logic.
- **Redirection Engine**: Special route handler configured at the root level (`GET /:shortCode`) optimized for low-latency queries, background analytics logging, real-time dispatch, and HTTP 302 redirection.

### 3. Real-Time Sync Layer (WebSockets)
- **Technology**: Socket.IO integration overlaying the Express HTTP instance.
- **Mechanism**:
  1. A user logs into the dashboard; their browser opens a WebSocket channel and joins a room specific to their `user_id`.
  2. If the user is an admin, they join the `admin` room.
  3. When an end-user clicks a short URL, the redirection controller logs it to the database and calls the socket service.
  4. The socket service sends a live event (`visit_logged`) to the respective owner's room and the admin room.
  5. The front-end receives the event and immediately appends it to charts or real-time lists without requiring a full page refresh.

### 4. Database Layer (PostgreSQL)
- **Driver**: Native PostgreSQL pool client `pg`.
- **Schema**: 3 tables with appropriate index structures designed for quick lookups on `short_code` and parent keys.
- **Aggregations**: Executes native date truncation queries (`DATE_TRUNC`) to compile click-count metrics directly in SQL, minimizing Node memory footprints.
