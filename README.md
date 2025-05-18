# React +  Hapi.js Todo App

This repository contains two applications:

- **Backend (Hapi Server)**: Hapi.js, SQLite, Knex.js
- **Frontend (React App)**: React, Vite

## Prerequisites
- Docker and Docker Compose (for Docker usage)
- Node.js and npm (for local usage)

## Environment Setup
Copy the example environment files and set the required variables.
- Backend: `hapi-server/.env.example`
- Frontend: `react-app/.env.example` 

## Running with Docker
From the project root:
```bash
docker-compose up --build
```
## Running Locally
### Backend
```bash
cd hapi-server
npm install
npm run migrate
npm start
```

### Frontend
```bash
cd react-app
npm install
npm run dev
```

### URLS

- Backend API: http://localhost:3000
- API docs:   http://localhost:3000/docs
- Frontend:   http://localhost:5173