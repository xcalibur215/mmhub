from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from api.v1.routes.auth import get_current_active_user, get_current_admin_user
from db.session import get_db
from db.models.user import User, UserRole
from db.models.property import Property, PropertyStatus
from schemas.property import Property as PropertySchema, PropertyCreate, PropertyUpdate

router = APIRouter()


@router.get("/", response_model=List[PropertySchema])
def read_properties(
    skip: int = 0,
    limit: int = 100,
    location: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    bedrooms: Optional[int] = None,
    bathrooms: Optional[int] = None,
    property_type: Optional[str] = None,
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve properties with optional filters."""
    query = db.query(Property).filter(Property.status == PropertyStatus.AVAILABLE)
    
    if location:
        query = query.filter(Property.location.contains(location))
    if min_price:
        query = query.filter(Property.monthly_rent >= min_price)
    if max_price:
        query = query.filter(Property.monthly_rent <= max_price)
    if bedrooms:
        query = query.filter(Property.bedrooms >= bedrooms)
    if bathrooms:
        query = query.filter(Property.bathrooms >= bathrooms)
    if property_type:
        query = query.filter(Property.property_type == property_type)
    
    properties = query.offset(skip).limit(limit).all()
    return properties


@router.get("/{property_id}", response_model=PropertySchema)
def read_property(
    property_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """Get property by ID."""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    return property


@router.post("/", response_model=PropertySchema)
def create_property(
    property_in: PropertyCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """Create new property."""
    # Only landlords and agents can create properties
    if current_user.role not in [UserRole.LANDLORD, UserRole.AGENT, UserRole.ADMIN]:
        raise HTTPException(
            status_code=403, detail="Not enough permissions to create properties"
        )
    
    property = Property(
        **property_in.dict(),
        owner_id=current_user.id
    )
    db.add(property)
    db.commit()
    db.refresh(property)
    return property


@router.put("/{property_id}", response_model=PropertySchema)
def update_property(
    property_id: int,
    property_in: PropertyUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """Update property."""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Only owner or admin can update
    if property.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = property_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(property, field, value)
    
    db.add(property)
    db.commit()
    db.refresh(property)
    return property


@router.delete("/{property_id}")
def delete_property(
    property_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """Delete property."""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Only owner or admin can delete
    if property.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(property)
    db.commit()
    return {"message": "Property deleted successfully"}


@router.get("/my/properties", response_model=List[PropertySchema])
def read_my_properties(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """Get current user's properties."""
    properties = db.query(Property).filter(Property.owner_id == current_user.id).all()
    return properties