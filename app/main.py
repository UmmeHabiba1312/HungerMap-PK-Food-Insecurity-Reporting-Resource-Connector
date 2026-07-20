from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import cases, organisations, referrals, contact, stats

app = FastAPI(
    title="HungerMap PK API",
    description="Backend for food insecurity case reporting, urgency triage, "
    "NGO matching, and referral letter generation.",
    version="0.1.0",
)

# Allow the deployed frontend (Vercel) and local dev origins to call this API.
# NOTE: allow_credentials=True requires an explicit origin list — "*" is rejected
# by browsers when credentials are allowed, so we never use "*" here.
ALLOWED_ORIGINS = [
    "https://hunger-pk.vercel.app",   # production frontend
    "http://localhost:3000",          # frontend dev server
    "http://localhost:8000",          # backend dev (docs etc.)
    # Add Vercel preview URLs here if you use preview deployments, e.g.:
    # "https://hunger-pk-git-*.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cases.router)
app.include_router(organisations.router)
app.include_router(referrals.router)
app.include_router(contact.router)
app.include_router(stats.router)


def ensure_db():
    """Create tables and seed demo orgs. Idempotent — safe to run on every boot.

    Also called at import time so serverless platforms (Vercel) have a ready DB,
    since their ASGI lifespan is disabled and the startup event never fires.
    """
    from app.database import DATABASE_URL, init_db
    from app.seed_data import seed

    init_db()
    try:
        seed()
    except Exception as exc:  # never let seeding break startup
        print(f"[HungerMap PK] Seeding skipped: {exc}")
    safe_url = DATABASE_URL.split("@")[-1] if "@" in DATABASE_URL else DATABASE_URL
    print(f"[HungerMap PK] Connected to database: {safe_url}")


# Run at import time for serverless (Vercel) cold starts.
ensure_db()


@app.on_event("startup")
def on_startup():
    ensure_db()


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok", "service": "HungerMap PK API"}
