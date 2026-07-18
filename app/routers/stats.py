from collections import Counter, defaultdict
from datetime import datetime
from typing import Dict, List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.models import Case, Organisation, Referral

router = APIRouter(prefix="/stats", tags=["stats"])

_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


@router.get("/overview")
def overview(session: Session = Depends(get_session)) -> Dict:
    """Real aggregate metrics that power the dashboard Reports view."""
    cases: List[Case] = session.exec(select(Case)).all()
    orgs: List[Organisation] = session.exec(select(Organisation)).all()
    referrals: List[Referral] = session.exec(select(Referral)).all()

    by_status = Counter(c.status.value for c in cases)
    by_urgency = Counter(c.urgency.value for c in cases if c.urgency)
    by_city = Counter(c.city for c in cases)

    # Monthly case volume for the current year (for the bar chart).
    now_year = datetime.utcnow().year
    monthly = defaultdict(int)
    for c in cases:
        if c.created_at and c.created_at.year == now_year:
            monthly[c.created_at.month] += 1
    monthly_series = [
        {"month": _MONTHS[m - 1], "count": monthly.get(m, 0)} for m in range(1, 13)
    ]

    triaged = by_status.get("triaged", 0) + by_status.get("referred", 0) + by_status.get("closed", 0)
    total = len(cases)
    cases_with_referral = len({r.case_id for r in referrals})
    match_rate = round((cases_with_referral / total) * 100) if total else 0

    return {
        "totals": {
            "cases": total,
            "organisations": len(orgs),
            "active_organisations": sum(1 for o in orgs if o.is_active),
            "referrals": len(referrals),
            "triaged": triaged,
            "pending": by_status.get("new", 0),
            "match_rate": match_rate,
        },
        "by_status": dict(by_status),
        "by_urgency": {
            "High": by_urgency.get("High", 0),
            "Medium": by_urgency.get("Medium", 0),
            "Low": by_urgency.get("Low", 0),
        },
        "by_city": [{"city": c, "count": n} for c, n in by_city.most_common()],
        "monthly": monthly_series,
        "year": now_year,
    }
