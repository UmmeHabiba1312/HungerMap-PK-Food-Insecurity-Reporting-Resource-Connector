from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import (
    Case,
    CaseStatus,
    Organisation,
    Referral,
    ReferralRead,
)
from app.ai_triage import run_ai_triage

router = APIRouter(tags=["referrals"])


@router.post("/cases/{case_id}/triage", response_model=ReferralRead, status_code=201)
def triage_case(case_id: int, session: Session = Depends(get_session)):
    """
    Runs triage for a case:
      1. Loads the case and candidate organisations in the same city.
      2. Calls run_ai_triage() (currently a stub — see app/ai_triage.py).
      3. Saves the result on the case (urgency, reason, status) and
         creates a Referral record with the generated letter.
    """
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    candidates = session.exec(
        select(Organisation).where(
            Organisation.city == case.city, Organisation.is_active == True  # noqa: E712
        )
    ).all()

    if not candidates:
        raise HTTPException(
            status_code=422,
            detail=f"No organisations on file for city '{case.city}' — add some first.",
        )

    result = run_ai_triage(case, candidates)

    # Save urgency onto the case
    case.urgency = result["urgency"]
    case.urgency_reason = result["urgency_reason"]
    case.status = CaseStatus.triaged
    case.updated_at = datetime.utcnow()
    session.add(case)

    # Remove any prior referrals for this case so re-triage doesn't stack duplicates.
    for old in session.exec(select(Referral).where(Referral.case_id == case.id)).all():
        session.delete(old)

    # Save the referral letter against the top match, plus a short note for the
    # other suggested organisations so they show up in the Referrals view.
    matches = result["matches"]
    top_match = matches[0]
    top_referral = Referral(
        case_id=case.id,
        organisation_id=top_match["organisation_id"],
        letter_text=result["letter"],
    )
    session.add(top_referral)

    for m in matches[1:]:
        session.add(
            Referral(
                case_id=case.id,
                organisation_id=m["organisation_id"],
                letter_text=f"Alternative match — {m['name']}: {m['why']}",
            )
        )

    session.commit()
    session.refresh(top_referral)
    return top_referral


@router.get("/cases/{case_id}/referrals", response_model=List[ReferralRead])
def get_case_referrals(case_id: int, session: Session = Depends(get_session)):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return session.exec(select(Referral).where(Referral.case_id == case_id)).all()
