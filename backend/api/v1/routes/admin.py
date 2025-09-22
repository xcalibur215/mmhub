from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.v1.routes.auth import get_current_admin_user
from db.models.property import Property, PropertyStatus, PropertyType
from db.models.user import User, UserRole
from db.session import get_db
from schemas.user import User as UserSchema
from schemas.user import RoleUpdate

router = APIRouter()


@router.get("/dashboard")
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """Retrieve admin dashboard stats."""
    # User stats
    user_stats = {
        "total": db.query(User).count(),
        "active": db.query(User).filter(User.is_active.is_(True)).count(),
        "by_role": {
            role: db.query(User).filter(User.role == role).count()
            for role in [
                UserRole.ADMIN.value,
                UserRole.USER.value,
                UserRole.AGENT.value,
                UserRole.LANDLORD.value,
            ]
        },
    }

    # Property stats aligned with current model
    property_stats = {
        "total": db.query(Property).count(),
        "available": db.query(Property)
        .filter(Property.status == PropertyStatus.AVAILABLE.value)
        .count(),
        "by_type": {
            pt.value: db.query(Property)
            .filter(Property.property_type == pt.value)
            .count()
            for pt in [
                PropertyType.APARTMENT,
                PropertyType.HOUSE,
                PropertyType.CONDO,
                PropertyType.TOWNHOUSE,
                PropertyType.STUDIO,
                PropertyType.ROOM,
            ]
        },
    }

    return {
        "user_stats": user_stats,
        "property_stats": property_stats,
        "recent_activity": {"users": [], "properties": []},  # Placeholder
    }


@router.get("/users", response_model=List[UserSchema])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """Retrieve users (admin only)."""
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.put("/users/{user_id}/role", response_model=UserSchema)
def update_user_role(
    user_id: int,
    role_in: RoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """Update a user's role (admin only).
    Safeguards:
    - Cannot remove the last admin from being an admin
    - Role must be a valid UserRole
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_role = role_in.role.value
    current_role = user.role
    if new_role == current_role:
        return user

    # Prevent removing last admin
    if current_role == UserRole.ADMIN.value and new_role != UserRole.ADMIN.value:
        other_admins = db.query(User).filter(
            User.role == UserRole.ADMIN.value, User.id != user.id
        ).count()
        if other_admins == 0:
            raise HTTPException(status_code=400, detail="Cannot remove the last admin")

    user.role = new_role
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
