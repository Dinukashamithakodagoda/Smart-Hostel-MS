# Smart Hostel Backend

Minimal Node.js + Express + MongoDB backend for the frontend app.

## Setup

1. Copy the env file:
   - `copy .env.example .env`
2. Update `MONGO_URI` and `JWT_SECRET`.
3. Install dependencies:
   - `npm install`
4. Run locally:
   - `npm run dev`

## Base URL

- `http://localhost:5000`

## Routes (starter)

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `GET /api/complaints`
- `POST /api/complaints`
- `GET /api/canteen/items`
- `POST /api/canteen/items`
- `POST /api/canteen/orders`
- `GET /api/tasks`
- `POST /api/tasks`
