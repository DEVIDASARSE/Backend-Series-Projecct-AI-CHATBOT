# AI Chatbot (Frontend + Backend Connected)

## Run locally (live)

### 1) Start backend
```bash
cd backend
npm start
```
Backend URL: `http://localhost:3000`

### 2) Start frontend
```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 4173
```
Frontend URL: `http://localhost:4173`

The frontend is connected to backend through:
- `VITE_API_BASE_URL` (default `http://localhost:3000`)

## Deploy (Render)

This repo includes `render.yaml` for one-click style infrastructure setup.

### Services
- `ai-chatbot-backend` (Node web service)
- `ai-chatbot-frontend` (static site)

### Deploy steps
1. Push this repository to GitHub.
2. In Render, create a **Blueprint** and point to this repo.
3. Render will create both services from `render.yaml`.
4. After deploy, frontend will call deployed backend via `VITE_API_BASE_URL`.

## API endpoints
- `GET /health`
- `POST /chat` with `{ "message": "..." }`
