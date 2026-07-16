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
    session.add(case)

    # Save the referral letter against the top-matched organisation
    top_match = result["matches"][0]
    referral = Referral(
        case_id=case.id,
        organisation_id=top_match["organisation_id"],
        letter_text=result["letter"],
    )
    session.add(referral)
    session.commit()
    session.refresh(referral)
    return referral


@router.get("/cases/{case_id}/referrals", response_model=List[ReferralRead])
def get_case_referrals(case_id: int, session: Session = Depends(get_session)):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return session.exec(select(Referral).where(Referral.case_id == case_id)).all()
