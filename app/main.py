from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import cases, organisations, referrals

app = FastAPI(
    title="HungerMap PK API",
    description="Backend for food insecurity case reporting, urgency triage, "
    "NGO matching, and referral letter generation.",
    version="0.1.0",
)

# Allow the frontend (running on a different port/domain during dev) to call this API.
# Tighten this to your real frontend domain(s) before going to production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cases.router)
app.include_router(organisations.router)
app.include_router(referrals.router)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok", "service": "HungerMap PK API"}
