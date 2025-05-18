# React +  Hapi.js Todo App

This repository contains two applications:

- **Backend (Hapi Server)**: Hapi.js, SQLite, Knex.js
- **Frontend (React App)**: React, Vite

## Prerequisites
- Docker and Docker Compose (for Docker usage)
- Node.js and npm (for local usage)

## Environment Setup
- Backend: Copy `hapi-server/.env.example` to `hapi-server/.env` and set `JWT_SECRET`.
- Frontend: Copy `react-app/.env.example` to `react-app/.env` and set `VITE_API_BASE_URL` (default: `http://localhost:3000`).

## Running with Docker
From the project root:
```bash
docker-compose up --build
```
- Backend API: http://localhost:3000
- API docs:   http://localhost:3000/docs
- Frontend:   http://localhost

## Running Locally
### Backend
```bash
cd hapi-server
npm install
npx knex migrate:latest --knexfile knexfile.cjs
npm start
```
- API:  http://localhost:3000
- Docs: http://localhost:3000/docs

### Frontend
```bash
cd react-app
npm install
npm run dev
```

- Backend API: http://localhost:3000
- API docs:   http://localhost:3000/docs
- Frontend:   http://localhost (Docker) / http://localhost:5173 (local)