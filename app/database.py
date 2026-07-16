import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session

load_dotenv()
# SQLite by default — zero setup, one file, free.
# To move to Postgres later (e.g. Supabase / Neon free tier), just set
# DATABASE_URL as an env var, e.g.:
#   postgresql://user:password@host:5432/dbname
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hungermap.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


def init_db():
    """Create tables if they don't exist yet. Called once on app startup."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """FastAPI dependency — gives each request its own DB session."""
    with Session(engine) as session:
        yield session
