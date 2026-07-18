---
name: frontend-backend-wiring
description: How the HungerMap PK Next.js frontend connects to the FastAPI backend
metadata:
  type: project
---

Frontend↔backend connect through `src/lib/api.ts` (`API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"`). Backend CORS is open (`allow_origins=["*"]`). `frontend/.env.local` sets `NEXT_PUBLIC_API_URL=http://localhost:8000`.

All pages now hit real endpoints: report page → `casesApi.create`, contact page → `contactApi.create` (was a fake setTimeout before — now real, backed by `/contact/`), dashboard → cases/orgs/referrals/contact/stats. See [[hungermap-architecture]] for the full router + component map.

Local run: backend `python -m uvicorn app.main:app --host 127.0.0.1 --port 8000` (no --reload; DB is Neon Postgres per [[backend-setup-python314]]), frontend `npm run dev` in `frontend/` (port 3000; refuses to start if another dev server already holds the port — kill the old PID with PowerShell `Stop-Process`).
