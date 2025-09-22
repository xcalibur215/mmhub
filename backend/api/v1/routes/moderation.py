from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from api.v1.routes.auth import get_current_active_user
from api.v1.routes.auth import get_current_admin_user
from db.session import get_db
from db.models.flag import Flag, FlagStatus, FlagTarget
from db.models.user import User, UserRole

from pydantic import BaseModel


class FlagCreate(BaseModel):
    target_type: FlagTarget
    target_id: int
    reason: str


class FlagOut(BaseModel):
    id: int
    target_type: str
    target_id: int
    reason: str
    status: str
    notes: Optional[str]
    created_by: int
    resolved_by: Optional[int]
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True


class FlagResolve(BaseModel):
    status: FlagStatus  # resolved or dismissed
    notes: Optional[str] = None


router = APIRouter()


@router.post("/flags", response_model=FlagOut)
def create_flag(
    payload: FlagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    flag = Flag(
        target_type=payload.target_type.value,
        target_id=payload.target_id,
        reason=payload.reason,
        created_by=current_user.id,
        status=FlagStatus.OPEN.value,
    )
    db.add(flag)
    db.commit()
    db.refresh(flag)
    return flag


@router.get("/moderation/flags", response_model=List[FlagOut])
def list_flags(
    status: Optional[FlagStatus] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    # Allow both admin and moderator roles
    if current_user.role not in [UserRole.ADMIN.value, UserRole.MODERATOR.value]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    q = db.query(Flag)
    if status is not None:
        q = q.filter(Flag.status == status.value)
    return q.order_by(Flag.created_at.desc()).all()


@router.post("/moderation/flags/{flag_id}/resolve", response_model=FlagOut)
def resolve_flag(
    flag_id: int,
    payload: FlagResolve,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    # Allow both admin and moderator roles
    if current_user.role not in [UserRole.ADMIN.value, UserRole.MODERATOR.value]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    flag = db.query(Flag).filter(Flag.id == flag_id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")
    if payload.status not in [FlagStatus.RESOLVED, FlagStatus.DISMISSED]:
        raise HTTPException(status_code=400, detail="Invalid status change")
    flag.status = payload.status.value
    flag.notes = payload.notes
    flag.resolved_by = current_user.id
    flag.resolved_at = datetime.utcnow()
    db.add(flag)
    db.commit()
    db.refresh(flag)
    return flag
