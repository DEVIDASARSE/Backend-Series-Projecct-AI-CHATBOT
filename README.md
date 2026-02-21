# AI Chatbot (Frontend + Backend Connected)

## Local run (live)

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

Frontend uses:
- `VITE_API_BASE_URL` (default `http://localhost:3000`)

---

## Deploy target requested by you
- **Backend on Render**
- **Frontend on Vercel**

## Backend deploy on Render
This repo includes `render.yaml` for backend service provisioning.

### Steps
1. Push repo to GitHub.
2. In Render, create a **Blueprint** from this repo.
3. Deploy service `ai-chatbot-backend`.
4. Copy backend public URL (example: `https://ai-chatbot-backend.onrender.com`).

Health check after deploy:
```bash
curl https://<your-render-backend>/health
```

## Frontend deploy on Vercel
`vercel.json` is added for Vite static deployment.

### Steps
1. Import this repo in Vercel.
2. Set **Root Directory** = `frontend`.
3. Add Environment Variable:
   - `VITE_API_BASE_URL=https://<your-render-backend>`
4. Deploy.

After deploy, Vercel frontend will call Render backend via `VITE_API_BASE_URL`.

## If app is not running (quick fix)
1. Open deployed frontend.
2. Check top status: it should show **Connected**.
3. If not connected, copy API URL shown in footer (`API: ...`).
4. Open `<API_URL>/health` in browser:
   - If you get `{ "ok": true ... }`, backend is fine.
   - If failed, fix `VITE_API_BASE_URL` in Vercel env and redeploy.
5. Make sure backend URL uses **https** (not http).

## API endpoints
- `GET /health`
- `POST /chat` with `{ "message": "..." }`

## No Vercel CLI required
You can deploy using Vercel Dashboard only (recommended in restricted environments):
1. Import repo in Vercel
2. Set root directory = `frontend`
3. Set `VITE_API_BASE_URL` to your Render backend URL
4. Click Deploy

Optional local config check (without Vercel CLI):
```bash
node scripts/check-vercel-config.mjs
```

> Note: In restricted environments, **do not rely on** `npm install -D vercel` or `vercel --version`.
> Use Vercel Dashboard deployment flow above.
