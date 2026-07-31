# AI Chatbot (Frontend + Backend Connected)

Production-ready full-stack chat app with:
- **Backend**: Node.js API (`/health`, `/chat`)
- **Frontend**: Vite + React chat UI

## Run locally

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

## Deploy option A (Render Blueprint: backend + frontend)

This repo includes `render.yaml` for one-click style infrastructure setup.

### Services
- `ai-chatbot-backend` (Node web service)
- `ai-chatbot-frontend` (static site)

### Deploy steps
1. Push this repository to GitHub.
2. In Render, create a **Blueprint** and point to this repo.
3. Render will create both services from `render.yaml`.
4. Open the **frontend Render URL** as your primary app URL.

Notes:
- Backend root (`/`) returns API information, and `/health` is the health endpoint.
- `VITE_API_BASE_URL` is linked from the backend service host in Render and is normalized to `https://...` by the frontend.

## Deploy option B (Vercel frontend + Render backend)

This repo now includes a root `vercel.json` so Vercel serves the React app from `frontend/` instead of a root 404.

1. Deploy backend first on Render (service URL example: `https://ai-chatbot-backend.onrender.com`).
2. Import this repository into Vercel.
3. In Vercel project env vars, set:
   - `VITE_API_BASE_URL=https://<your-render-backend-domain>`
4. Redeploy and open the Vercel root URL.

## API endpoints
- `GET /` basic backend info
- `GET /health`
- `POST /chat` with `{ "message": "..." }`
