# Brindra

Brindra is a full-stack team collaboration platform for project management, messaging, files, and workspace settings. It includes role-based access, plan-based feature gating, real-time chat signals, and a modern React UI.

## Tech Stack

- Frontend: React 19, Vite 8, Tailwind CSS 4, Framer Motion, Axios, React Toastify, Recharts, Socket.IO client
- Backend: Node.js, Express 5, Mongoose, JWT auth, bcrypt, Socket.IO
- Database: MongoDB

## Features

- Authentication with access/refresh token flow
- Role-aware UI controls (`team_leader`, `manager`, `member`)
- Plan-aware feature access (`demo`, `starter`, `growth`, `enterprise`)
- Project, task, message, and file collaboration modules
- User profile and settings management
- Theme and accent customization
- Real-time typing and message events with Socket.IO

## Repository Structure

```text
.
|- frontend/        # React + Vite client
|- Backend/         # Express + MongoDB API
`- README.md
```

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- MongoDB instance (local or cloud)

## Environment Variables

### Backend (`Backend/.env`)

```env
MONGO_URI=mongodb://127.0.0.1:27017/brindra
PORT=5000
JWT_SECRET=replace_with_secure_access_secret
JWT_REFRESH_SECRET=replace_with_secure_refresh_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### Frontend (`frontend/.env`, optional)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

If `VITE_API_BASE_URL` is not set, frontend defaults to `http://localhost:5000/api`.

## Local Setup

### 1) Install dependencies

```bash
cd Backend
npm install

cd ../frontend
npm install
```

### 2) Start backend

```bash
cd Backend
npm run dev
```

Backend runs on `http://localhost:5000` by default.

### 3) Start frontend

```bash
cd frontend
npm run dev
```

Frontend runs on Vite default port (usually `http://localhost:5173`).

## Available Scripts

### Backend (`Backend/package.json`)

- `npm run dev` - Start API with nodemon
- `npm start` - Start API with node
- `npm run seed:brindra` - Seed sample users/projects/tasks/messages/files

### Frontend (`frontend/package.json`)

- `npm run dev` - Start Vite dev server
- `npm run build` - Build production assets
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Overview

Base URL: `http://localhost:5000/api`

### Health

- `GET /health`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /auth/settings`
- `PUT /auth/settings`
- `PUT /auth/change-password`
- `POST /auth/refresh`
- `POST /auth/logout`

### Collaboration

- `POST /collab/users`
- `GET /collab/users`
- `POST /collab/projects`
- `GET /collab/projects`
- `POST /collab/tasks`
- `GET /collab/tasks`
- `PUT /collab/tasks/:id`
- `POST /collab/messages`
- `GET /collab/messages`
- `POST /collab/files`
- `GET /collab/files`
- `DELETE /collab/files/:id`

## Real-Time Events (Socket.IO)

### Client emits

- `join_project`
- `leave_project`
- `join_user`
- `leave_user`
- `project_typing`
- `direct_typing`

### Server emits

- `project_typing`
- `direct_typing`
- `project_message:new`
- `direct_message:new`

## Authentication Notes

- API expects `Authorization: Bearer <access_token>` for protected endpoints.
- Frontend stores session tokens and automatically attempts refresh on `401`.

## CORS

Backend currently allows origins matching:

- `http://localhost:<port>`
- `http://127.0.0.1:<port>`

## Seed Data

Run:

```bash
cd Backend
npm run seed:brindra
```

This creates sample users, projects, tasks, messages, and files for quick testing.

## Current Status

- Project is actively developed.
- No automated test suite is configured yet in backend (`npm test` placeholder).

## License

No explicit project license is defined yet. Add a `LICENSE` file to set usage terms.
