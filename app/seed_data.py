"""
Run this once to populate the database with a starter list of organisations,
so cases and triage have something real to match against.

Usage:
    python -m app.seed_data
"""

from sqlmodel import Session, select

from app.database import engine, init_db
from app.models import Organisation

DEMO_ORGS = [
    {"name": "Saylani Welfare International Trust", "city": "Karachi",
     "focus": "Daily free meals (Dastarkhwan), ration bags",
     "contact_info": "Multiple centres — verify current contact via official site"},
    {"name": "Edhi Foundation", "city": "Karachi",
     "focus": "Emergency food support, shelters",
     "contact_info": "City-wide network — verify current contact via official site"},
    {"name": "Alkhidmat Foundation Karachi", "city": "Karachi",
     "focus": "Monthly ration packages, zakat-based aid",
     "contact_info": "Area offices — verify current contact via official site"},
    {"name": "Chhipa Welfare Association", "city": "Karachi",
     "focus": "Free food distribution, emergency relief",
     "contact_info": "Multiple distribution points — verify via official site"},
    {"name": "Akhuwat Foundation", "city": "Lahore",
     "focus": "Food & interest-free relief support",
     "contact_info": "Branches across Lahore — verify via official site"},
    {"name": "Alkhidmat Foundation Lahore", "city": "Lahore",
     "focus": "Ration packages, langar service",
     "contact_info": "Zonal offices — verify via official site"},
    {"name": "Islamic Relief Pakistan (Islamabad Office)", "city": "Islamabad",
     "focus": "Food parcels, emergency relief",
     "contact_info": "National HQ — verify via official site"},
    {"name": "Alkhidmat Foundation Islamabad", "city": "Islamabad",
     "focus": "Ration support, zakat aid",
     "contact_info": "Sector-based offices — verify via official site"},
]


def seed():
    init_db()
    with Session(engine) as session:
        existing = session.exec(select(Organisation)).first()
        if existing:
            print("Organisations already exist — skipping seed.")
            return
        for org in DEMO_ORGS:
            session.add(Organisation(**org))
        session.commit()
        print(f"Seeded {len(DEMO_ORGS)} organisations.")


if __name__ == "__main__":
    seed()
