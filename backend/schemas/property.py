from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from db.models.property import PropertyStatus, PropertyType
from schemas.user import UserSummary


# Amenity schemas
class AmenityBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None


class Amenity(AmenityBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True


# Property Photo schemas
class PropertyPhotoBase(BaseModel):
    url: str
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    display_order: int = 0
    is_primary: bool = False


class PropertyPhotoCreate(PropertyPhotoBase):
    pass


class PropertyPhoto(PropertyPhotoBase):
    id: int
    property_id: int
    file_size: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Property schemas
class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    property_type: PropertyType
    address: str
    city: str
    state: str
    postal_code: str
    country: str = "US"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    bedrooms: int = Field(ge=0)
    bathrooms: float = Field(ge=0)
    square_feet: Optional[int] = Field(None, ge=0)
    lot_size: Optional[float] = Field(None, ge=0)
    year_built: Optional[int] = Field(None, ge=1800, le=2030)
    floor_number: Optional[int] = Field(None, ge=0)
    total_floors: Optional[int] = Field(None, ge=1)
    rent_price: float = Field(gt=0)
    security_deposit: Optional[float] = Field(None, ge=0)
    is_furnished: bool = False
    pets_allowed: bool = False
    smoking_allowed: bool = False
    parking_available: bool = False
    utilities_included: bool = False
    min_lease_term: Optional[int] = Field(None, ge=1)
    max_lease_term: Optional[int] = Field(None, ge=1)
    available_from: Optional[datetime] = None


class PropertyCreate(PropertyBase):
    amenity_ids: Optional[List[int]] = []


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[PropertyType] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[float] = Field(None, ge=0)
    square_feet: Optional[int] = Field(None, ge=0)
    lot_size: Optional[float] = Field(None, ge=0)
    year_built: Optional[int] = Field(None, ge=1800, le=2030)
    floor_number: Optional[int] = Field(None, ge=0)
    total_floors: Optional[int] = Field(None, ge=1)
    rent_price: Optional[float] = Field(None, gt=0)
    security_deposit: Optional[float] = Field(None, ge=0)
    is_furnished: Optional[bool] = None
    pets_allowed: Optional[bool] = None
    smoking_allowed: Optional[bool] = None
    parking_available: Optional[bool] = None
    utilities_included: Optional[bool] = None
    min_lease_term: Optional[int] = Field(None, ge=1)
    max_lease_term: Optional[int] = Field(None, ge=1)
    available_from: Optional[datetime] = None
    status: Optional[PropertyStatus] = None
    is_featured: Optional[bool] = None
    amenity_ids: Optional[List[int]] = None


class Property(PropertyBase):
    id: int
    status: PropertyStatus
    views_count: int
    is_featured: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
    owner_id: int
    owner: UserSummary
    photos: List[PropertyPhoto] = []
    # Direct Amenity objects (via secondary) for convenience
    amenities: List[Amenity] = []

    class Config:
        from_attributes = True


class PropertySummary(BaseModel):
    id: int
    title: str
    property_type: PropertyType
    city: str
    state: str
    bedrooms: int
    bathrooms: float
    rent_price: float
    is_featured: bool
    primary_photo_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Property search schemas
class PropertySearchFilters(BaseModel):
    city: Optional[str] = None
    state: Optional[str] = None
    property_type: Optional[PropertyType] = None
    min_price: Optional[float] = Field(None, ge=0)
    max_price: Optional[float] = Field(None, ge=0)
    min_bedrooms: Optional[int] = Field(None, ge=0)
    max_bedrooms: Optional[int] = Field(None, ge=0)
    min_bathrooms: Optional[float] = Field(None, ge=0)
    max_bathrooms: Optional[float] = Field(None, ge=0)
    min_square_feet: Optional[int] = Field(None, ge=0)
    max_square_feet: Optional[int] = Field(None, ge=0)
    pets_allowed: Optional[bool] = None
    parking_available: Optional[bool] = None
    is_furnished: Optional[bool] = None
    amenity_ids: Optional[List[int]] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_km: Optional[float] = Field(None, ge=0, le=100)


class PropertySearchResponse(BaseModel):
    properties: List[PropertySummary]
    total: int
    page: int
    page_size: int
    total_pages: int
