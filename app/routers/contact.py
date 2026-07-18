from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import ContactMessage, ContactMessageCreate, ContactMessageRead

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/", response_model=ContactMessageRead, status_code=201)
def create_message(msg: ContactMessageCreate, session: Session = Depends(get_session)):
    db_msg = ContactMessage.model_validate(msg)
    session.add(db_msg)
    session.commit()
    session.refresh(db_msg)
    return db_msg


@router.get("/", response_model=List[ContactMessageRead])
def list_messages(session: Session = Depends(get_session)):
    return session.exec(
        select(ContactMessage).order_by(ContactMessage.created_at.desc())
    ).all()


@router.patch("/{msg_id}/read", response_model=ContactMessageRead)
def mark_read(msg_id: int, session: Session = Depends(get_session)):
    msg = session.get(ContactMessage, msg_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    session.add(msg)
    session.commit()
    session.refresh(msg)
    return msg
