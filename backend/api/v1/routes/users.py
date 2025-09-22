from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.v1.routes.auth import get_current_active_user, get_current_admin_user
from db.models.property import Property
from db.models.user import User, UserRole
from db.session import get_db
from schemas.user import User as UserSchema
from schemas.user import UserSummary, UserUpdate

router = APIRouter()


@router.get("/", response_model=List[UserSummary])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """Retrieve users (admin only)."""
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/me", response_model=UserSchema)
def read_user_me(current_user: User = Depends(get_current_active_user)) -> Any:
    """Get current user."""
    return current_user


@router.get("/{user_id}", response_model=UserSchema)
def read_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """Get a specific user by id."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404, detail="The user with this id does not exist in the system"
        )

    # Users can only see their own profile, unless they're admin
    if user != current_user and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    return user


@router.put("/me", response_model=UserSchema)
def update_user_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """Update own user."""
    if user_in.email is not None:
        existing_user = (
            db.query(User)
            .filter(User.email == user_in.email, User.id != current_user.id)
            .first()
        )
        if existing_user:
            raise HTTPException(
                status_code=400, detail="User with this email already exists"
            )
        setattr(current_user, 'email', user_in.email)

    if user_in.username is not None:
        existing_user = (
            db.query(User)
            .filter(User.username == user_in.username, User.id != current_user.id)
            .first()
        )
        if existing_user:
            raise HTTPException(
                status_code=400, detail="User with this username already exists"
            )
        setattr(current_user, 'username', user_in.username)

    if user_in.first_name is not None:
        setattr(current_user, 'first_name', user_in.first_name)
    if user_in.last_name is not None:
        setattr(current_user, 'last_name', user_in.last_name)
    if user_in.phone is not None:
        setattr(current_user, 'phone', user_in.phone)
    if user_in.bio is not None:
        setattr(current_user, 'bio', user_in.bio)
    if user_in.avatar_url is not None:
        setattr(current_user, 'avatar_url', user_in.avatar_url)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/{user_id}", response_model=UserSchema)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> Any:
    """Update a user (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404, detail="The user with this id does not exist in the system"
        )

    # Prevent admin from deactivating their own account
    if user_in.is_active is not None and user.id == current_user.id and user_in.is_active is False:
        raise HTTPException(status_code=400, detail="Cannot deactivate your own account")

    if user_in.email is not None:
        existing_user = (
            db.query(User)
            .filter(User.email == user_in.email, User.id != user_id)
            .first()
        )
        if existing_user:
            raise HTTPException(
                status_code=400, detail="User with this email already exists"
            )
        setattr(user, 'email', user_in.email)

    if user_in.username is not None:
        existing_user = (
            db.query(User)
            .filter(User.username == user_in.username, User.id != user_id)
            .first()
        )
        if existing_user:
            raise HTTPException(
                status_code=400, detail="User with this username already exists"
            )
        setattr(user, 'username', user_in.username)

    if user_in.first_name is not None:
        setattr(user, 'first_name', user_in.first_name)
    if user_in.last_name is not None:
        setattr(user, 'last_name', user_in.last_name)
    if user_in.phone is not None:
        setattr(user, 'phone', user_in.phone)
    if user_in.bio is not None:
        setattr(user, 'bio', user_in.bio)
    if user_in.avatar_url is not None:
        setattr(user, 'avatar_url', user_in.avatar_url)

    if user_in.is_active is not None:
        setattr(user, 'is_active', bool(user_in.is_active))

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> Any:
    """Delete a user (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404, detail="The user with this id does not exist in the system"
        )

    # Prevent admin from deleting themselves
    if user.id == current_user.id:  # type: ignore
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


@router.post("/me/favorites/{property_id}", response_model=UserSchema)
def add_favorite_property(
    property_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """Add a property to the current user's favorites."""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    if property in current_user.favorite_properties:
        raise HTTPException(status_code=400, detail="Property already in favorites")

    current_user.favorite_properties.append(property)
    db.commit()
    return current_user


@router.delete("/me/favorites/{property_id}", response_model=UserSchema)
def remove_favorite_property(
    property_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """Remove a property from the current user's favorites."""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    if property not in current_user.favorite_properties:
        raise HTTPException(status_code=400, detail="Property not in favorites")

    current_user.favorite_properties.remove(property)
    db.commit()
    return current_user
