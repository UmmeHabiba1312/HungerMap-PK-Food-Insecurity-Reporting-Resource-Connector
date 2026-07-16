# HungerMap PK — Backend

FastAPI backend for food insecurity case reporting, urgency triage, NGO matching,
and referral letter generation.

## Stack

- **FastAPI** — web framework
- **SQLModel** — ORM (Pydantic + SQLAlchemy combined)
- **SQLite** by default (zero setup, one file, free). Swap to Postgres later
  (Supabase / Neon free tiers both work) by just changing `DATABASE_URL`.

## Setup

```bash
cd hungermap-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # edit if you need Postgres or an API key later

python -m app.seed_data         # loads a starter list of organisations
uvicorn app.main:app --reload   # starts the server on http://localhost:8000
```

Interactive API docs (auto-generated): **http://localhost:8000/docs**

## Project structure

```
app/
  main.py            # FastAPI app, CORS, router registration
  database.py         # DB engine + session
  models.py            # SQLModel tables: Case, Organisation, Referral
  ai_triage.py           # STUB — the AI developer implements the real Claude call here
  seed_data.py             # loads demo organisations into the DB
  routers/
    cases.py               # case CRUD
    organisations.py         # organisation CRUD
    referrals.py               # triage trigger + referral records
```

## API contract (for frontend + AI dev)

### Cases
| Method | Path | Purpose |
|---|---|---|
| POST | `/cases/` | Submit a new case |
| GET | `/cases/` | List cases (filter by `?city=` and/or `?status=`) |
| GET | `/cases/{id}` | Get one case |
| PATCH | `/cases/{id}` | Update status / urgency manually |
| DELETE | `/cases/{id}` | Delete a case |

**POST /cases/ body:**
```json
{
  "volunteer_name": "Ali Raza",
  "volunteer_phone": "0300-1234567",
  "city": "Karachi",
  "area": "Landhi",
  "household_size": 6,
  "beneficiary_name": "M. Aslam",
  "beneficiary_phone": null,
  "situation_notes": "No cooked meal in 2 days, father lost job, 3 children under 10"
}
```

### Organisations
| Method | Path | Purpose |
|---|---|---|
| POST | `/organisations/` | Add an organisation |
| GET | `/organisations/?city=Karachi` | List organisations, filterable by city |
| GET | `/organisations/{id}` | Get one |
| PATCH | `/organisations/{id}` | Update |
| DELETE | `/organisations/{id}` | Remove |

### Triage & Referrals
| Method | Path | Purpose |
|---|---|---|
| POST | `/cases/{id}/triage` | Runs triage (urgency + matching + letter), saves a Referral |
| GET | `/cases/{id}/referrals` | List referral letters generated for a case |

`POST /cases/{id}/triage` currently returns **placeholder data** — see below.

## For the AI developer

Everything AI-related lives in **`app/ai_triage.py`**, specifically the
`run_ai_triage(case, candidate_organisations)` function. It's a stub right now
so the rest of the team isn't blocked. Replace its body with a real Claude API
call — keep the same input/output shape (documented in the file) so nothing
else needs to change.

## For the frontend developer

Base URL during development: `http://localhost:8000`
CORS is open (`allow_origins=["*"]`) for now — tighten before production.
Full request/response shapes are visible live at `/docs`.

## Notes

- No auth is implemented yet — add JWT-based auth to `/cases` and
  `/organisations` write endpoints before this handles real beneficiary data.
- No beneficiary data should go to production without a clear privacy/consent
  policy — this backend does not currently encrypt or restrict access to
  `situation_notes`, `beneficiary_name`, or `beneficiary_phone`.
