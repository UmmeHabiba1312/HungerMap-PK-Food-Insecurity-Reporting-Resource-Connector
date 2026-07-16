from datetime import datetime
from enum import Enum
from typing import Optional, List

from sqlmodel import SQLModel, Field, Relationship


class UrgencyLevel(str, Enum):
    high = "High"
    medium = "Medium"
    low = "Low"


class CaseStatus(str, Enum):
    new = "new"           # just submitted, not triaged yet
    triaged = "triaged"    # urgency + matches decided
    referred = "referred"  # referral letter sent/shared
    closed = "closed"      # case resolved


# ---------- Organisation (food bank / NGO) ----------

class OrganisationBase(SQLModel):
    name: str
    city: str = Field(index=True)
    area: Optional[str] = None
    focus: Optional[str] = None          # e.g. "Daily free meals, ration bags"
    contact_info: Optional[str] = None   # phone / email / address
    is_active: bool = True


class Organisation(OrganisationBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    referrals: List["Referral"] = Relationship(back_populates="organisation")


class OrganisationCreate(OrganisationBase):
    pass


class OrganisationRead(OrganisationBase):
    id: int
    created_at: datetime


class OrganisationUpdate(SQLModel):
    name: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    focus: Optional[str] = None
    contact_info: Optional[str] = None
    is_active: Optional[bool] = None


# ---------- Case (food insecurity report) ----------

class CaseBase(SQLModel):
    volunteer_name: str
    volunteer_phone: Optional[str] = None
    city: str = Field(index=True)
    area: Optional[str] = None
    household_size: Optional[int] = None
    beneficiary_name: Optional[str] = None
    beneficiary_phone: Optional[str] = None
    situation_notes: str


class Case(CaseBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_code: str = Field(index=True, unique=True)
    status: CaseStatus = Field(default=CaseStatus.new)
    urgency: Optional[UrgencyLevel] = None
    urgency_reason: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    referrals: List["Referral"] = Relationship(back_populates="case")


class CaseCreate(CaseBase):
    pass


class CaseRead(CaseBase):
    id: int
    case_code: str
    status: CaseStatus
    urgency: Optional[UrgencyLevel]
    urgency_reason: Optional[str]
    created_at: datetime
    updated_at: datetime


class CaseUpdate(SQLModel):
    status: Optional[CaseStatus] = None
    urgency: Optional[UrgencyLevel] = None
    urgency_reason: Optional[str] = None


# ---------- Referral (generated letter linking a Case to an Organisation) ----------

class ReferralBase(SQLModel):
    case_id: int = Field(foreign_key="case.id")
    organisation_id: int = Field(foreign_key="organisation.id")
    letter_text: str


class Referral(ReferralBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    case: Optional[Case] = Relationship(back_populates="referrals")
    organisation: Optional[Organisation] = Relationship(back_populates="referrals")


class ReferralCreate(ReferralBase):
    pass


class ReferralRead(ReferralBase):
    id: int
    created_at: datetime
