---
name: hungermap-architecture
description: HungerMap PK feature architecture after the full functionality build
metadata:
  type: project
---

Full-stack food-insecurity app. Backend FastAPI+SQLModel (`app/`), frontend Next.js 16 / React 19 (`frontend/`).

**Backend routers** (`app/routers/`, registered in `main.py`):
- `cases.py` — case CRUD (POST/GET/GET{id}/PATCH/DELETE)
- `organisations.py` — NGO CRUD
- `referrals.py` — `POST /cases/{id}/triage` (calls AI, saves top referral + alt referrals for other matches; re-triage deletes old referrals first), `GET /cases/{id}/referrals`
- `contact.py` — `POST /contact/`, `GET /contact/`, `PATCH /contact/{id}/read` (ContactMessage model)
- `stats.py` — `GET /stats/overview` real aggregates (totals, by_status, by_urgency, by_city, monthly series, match_rate = cases-with-referral / total)

**AI triage** (`app/ai_triage.py`): `run_ai_triage()` calls Groq (OpenAI-compatible endpoint, model `llama-3.3-70b-versatile`) when `GROQ_API_KEY` env set, else a deterministic rule-based fallback (keyword signals + household size → urgency; templated referral letter). Never throws — Groq failure falls back. Currently no key set, so rule-based is active.

**Frontend**: shared API layer in `src/lib/api.ts` + `src/lib/types.ts` (typed fetch wrappers, ApiError). All pages use it. Dashboard (`src/app/dashboard/page.tsx`) is a view-switcher over `src/components/dashboard/`: Sidebar (My Cases, All Cases, Organisations, Referrals, Reports, Messages + Help modal + Back/Logout), CaseWorkspace (triage + status advance + letters), AllCasesView (search/filter/delete), OrganisationsView (CRUD modal), ReferralsView, ReportsView (real stats charts), MessagesView (unread badge), NewCaseForm. Shared UI primitives + toasts in `ui.tsx`/`useToasts.ts`. Report + contact pages wired to backend (contact was previously a fake setTimeout).

Theme: emerald/teal, Plus Jakarta Sans, tokens in `globals.css`. `frontend/tsconfig.json` has `@/*` → `./src/*`. `npm run build` passes clean; note `frontend/AGENTS.md` warns Next.js 16 has breaking changes — check `node_modules/next/dist/docs/` before Next-specific code.

Note: `schema.sql`/`seed_ngos.sql` at repo root describe an aspirational richer Postgres schema (cases/ngos/matches/volunteers) that does NOT match the live SQLModel models — ignore them. See [[backend-setup-python314]] and [[frontend-backend-wiring]].
