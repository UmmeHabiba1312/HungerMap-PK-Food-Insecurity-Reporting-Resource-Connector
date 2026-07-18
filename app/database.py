import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session

load_dotenv()
# SQLite by default — zero setup, one file, free.
# To move to Postgres later (e.g. Supabase / Neon free tier), just set
# DATABASE_URL as an env var, e.g.:
#   postgresql://user:password@host:5432/dbname
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hungermap.db")

is_sqlite = DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}

# For serverless Postgres (e.g. Neon) idle connections get dropped by the server,
# surfacing as "SSL SYSCALL error: EOF detected" on the next request. pool_pre_ping
# revalidates a pooled connection before use (reconnecting if it's dead), and
# pool_recycle proactively discards connections older than the timeout.
engine_kwargs = {"echo": False, "connect_args": connect_args}
if not is_sqlite:
    engine_kwargs.update(pool_pre_ping=True, pool_recycle=300)

engine = create_engine(DATABASE_URL, **engine_kwargs)


def init_db():
    """Create tables if they don't exist yet. Called once on app startup."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """FastAPI dependency — gives each request its own DB session."""
    with Session(engine) as session:
        yield session
