# Vercel serverless entrypoint for the HungerMap PK FastAPI backend.
#
# Vercel runs Python as serverless functions, so the ASGI app is adapted with
# Mangum. Vercel serves this file at the function URL and `vercel.json` rewrites
# every path ("/(.*)") here, so FastAPI handles routing, /docs, etc. as normal.
import os
import sys

# Vercel executes this file with cwd set to the api/ directory, so the project
# root must be added to sys.path for `from app.main import app` to resolve.
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from mangum import Mangum
from app.main import app as fastapi_app

# lifespan="off": serverless functions don't support startup/shutdown events
# reliably; DB init + seeding are done at import time inside app.main instead.
# Exposed as `app` so Vercel's Python runtime detects the ASGI entrypoint.
app = Mangum(fastapi_app, lifespan="off")
