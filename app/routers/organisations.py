from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models import Organisation, OrganisationCreate, OrganisationRead, OrganisationUpdate

router = APIRouter(prefix="/organisations", tags=["organisations"])


@router.post("/", response_model=OrganisationRead, status_code=201)
def create_organisation(org: OrganisationCreate, session: Session = Depends(get_session)):
    db_org = Organisation.model_validate(org)
    session.add(db_org)
    session.commit()
    session.refresh(db_org)
    return db_org


@router.get("/", response_model=List[OrganisationRead])
def list_organisations(
    city: Optional[str] = Query(default=None, description="Filter by city, e.g. Karachi"),
    active_only: bool = Query(default=True),
    session: Session = Depends(get_session),
):
    query = select(Organisation)
    if city:
        query = query.where(Organisation.city == city)
    if active_only:
        query = query.where(Organisation.is_active == True)  # noqa: E712
    return session.exec(query).all()


@router.get("/{org_id}", response_model=OrganisationRead)
def get_organisation(org_id: int, session: Session = Depends(get_session)):
    org = session.get(Organisation, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organisation not found")
    return org


@router.patch("/{org_id}", response_model=OrganisationRead)
def update_organisation(org_id: int, update: OrganisationUpdate, session: Session = Depends(get_session)):
    org = session.get(Organisation, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organisation not found")
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(org, field, value)
    session.add(org)
    session.commit()
    session.refresh(org)
    return org


@router.delete("/{org_id}", status_code=204)
def delete_organisation(org_id: int, session: Session = Depends(get_session)):
    org = session.get(Organisation, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organisation not found")
    session.delete(org)
    session.commit()
