from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from api.v1.routes.auth import get_current_admin_user
from db.session import get_db
from db.models.user import User, UserRole, UserStatus
from db.models.property import Property, PropertyStatus

router = APIRouter()


@router.get("/dashboard", response_model=Dict[str, Any])
def get_admin_dashboard(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """Get admin dashboard statistics."""
    
    # User statistics
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.status == UserStatus.ACTIVE).count()
    users_by_role = (
        db.query(User.role, func.count(User.id))
        .group_by(User.role)
        .all()
    )
    
    # Property statistics
    total_properties = db.query(Property).count()
    available_properties = db.query(Property).filter(Property.status == PropertyStatus.AVAILABLE).count()
    properties_by_type = (
        db.query(Property.property_type, func.count(Property.id))
        .group_by(Property.property_type)
        .all()
    )
    
    # Recent activity
    recent_users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .limit(5)
        .all()
    )
    
    recent_properties = (
        db.query(Property)
        .order_by(Property.created_at.desc())
        .limit(5)
        .all()
    )
    
    return {
        "user_stats": {
            "total": total_users,
            "active": active_users,
            "by_role": dict(users_by_role)
        },
        "property_stats": {
            "total": total_properties,
            "available": available_properties,
            "by_type": dict(properties_by_type)
        },
        "recent_activity": {
            "users": [
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "created_at": user.created_at
                }
                for user in recent_users
            ],
            "properties": [
                {
                    "id": prop.id,
                    "title": prop.title,
                    "city": prop.city,
                    "state": prop.state,
                    "monthly_rent": prop.monthly_rent,
                    "created_at": prop.created_at
                }
                for prop in recent_properties
            ]
        }
    }


@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    new_role: UserRole,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """Update user role (admin only)."""
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if target.id == current_user.id:  # type: ignore
        raise HTTPException(status_code=400, detail="Cannot change your own role")
    target.role = new_role.value if isinstance(new_role, UserRole) else str(new_role)  # type: ignore
    db.add(target)
    db.commit()
    db.refresh(target)
    return {"message": f"User role updated to {new_role}", "user": target}


@router.put("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    new_status: UserStatus,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """Update user status (admin only)."""
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if target.id == current_user.id:  # type: ignore
        raise HTTPException(status_code=400, detail="Cannot change your own status")
    target.status = new_status.value if isinstance(new_status, UserStatus) else str(new_status)  # type: ignore
    db.add(target)
    db.commit()
    db.refresh(target)
    return {"message": f"User status updated to {new_status}", "user": target}


@router.put("/properties/{property_id}/status")
def update_property_status(
    property_id: int,
    new_status: PropertyStatus,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Any:
    """Update property status (admin only)."""
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    prop.status = new_status.value if isinstance(new_status, PropertyStatus) else str(new_status)  # type: ignore
    db.add(prop)
    db.commit()
    db.refresh(prop)
    return {"message": f"Property status updated to {new_status}", "property": prop}