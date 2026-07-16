import random
import string
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models import Case, CaseCreate, CaseRead, CaseUpdate, CaseStatus

router = APIRouter(prefix="/cases", tags=["cases"])


def generate_case_code() -> str:
    suffix = "".join(random.choices(string.digits, k=4))
    return f"HM-{suffix}"


@router.post("/", response_model=CaseRead, status_code=201)
def create_case(case: CaseCreate, session: Session = Depends(get_session)):
    db_case = Case.model_validate(case.model_dump(), update={"case_code": generate_case_code()})
    session.add(db_case)
    session.commit()
    session.refresh(db_case)
    return db_case


@router.get("/", response_model=List[CaseRead])
def list_cases(
    city: Optional[str] = Query(default=None),
    status: Optional[CaseStatus] = Query(default=None),
    session: Session = Depends(get_session),
):
    query = select(Case)
    if city:
        query = query.where(Case.city == city)
    if status:
        query = query.where(Case.status == status)
    return session.exec(query.order_by(Case.created_at.desc())).all()


@router.get("/{case_id}", response_model=CaseRead)
def get_case(case_id: int, session: Session = Depends(get_session)):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.patch("/{case_id}", response_model=CaseRead)
def update_case(case_id: int, update: CaseUpdate, session: Session = Depends(get_session)):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(case, field, value)
    session.add(case)
    session.commit()
    session.refresh(case)
    return case


@router.delete("/{case_id}", status_code=204)
def delete_case(case_id: int, session: Session = Depends(get_session)):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    session.delete(case)
    session.commit()
