---
name: backend-setup-python314
description: HungerMap PK backend runtime, DB (Neon Postgres), and dependency quirks on Python 3.14
metadata:
  type: project
---

This machine runs Python 3.14.2 and Node v24.12.0.

**Database is Neon Postgres, NOT SQLite.** `DATABASE_URL` is set as an OS environment variable (loaded via python-dotenv) pointing to a Neon serverless Postgres instance (`ep-rough-bonus-...neon.tech/neondb`). The `sqlite:///./hungermap.db` in `database.py` is only the code default and is NOT used at runtime. `psycopg2` 2.9.11 is installed globally and works — the `psycopg2-binary==2.9.9` pin in requirements.txt fails to build on 3.14, so it's commented out (the working psycopg2 came from elsewhere/global).

**Neon idle-connection fix:** Neon drops idle pooled connections, surfacing as `psycopg2.OperationalError: SSL SYSCALL error: EOF detected` (HTTP 500) on the next request. Fixed in `app/database.py` by adding `pool_pre_ping=True, pool_recycle=300` to `create_engine` for non-sqlite URLs. If 500s with SSL EOF reappear, that's the cause.

**Version pins:** original `sqlmodel==0.0.22` + `fastapi==0.115.0` are incompatible with the globally-installed Pydantic 2.12 ("Field 'city' requires a type annotation"). requirements.txt now uses `sqlmodel>=0.0.24`, `fastapi>=0.115.6`, `uvicorn[standard]>=0.31.1`, `httpx>=0.27` (installed: sqlmodel 0.0.39, fastapi 0.139.2, uvicorn 0.51.0).

Run backend: `python -m uvicorn app.main:app --host 127.0.0.1 --port 8000` (uvicorn has NO --reload here, so restart after edits). Tables auto-create via `init_db()` on startup. See [[hungermap-architecture]] and [[frontend-backend-wiring]].
