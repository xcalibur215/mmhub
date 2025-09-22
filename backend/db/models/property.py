from datetime import datetime
from enum import Enum
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base


class PropertyType(str, Enum):
    APARTMENT = "apartment"
    HOUSE = "house"
    CONDO = "condo"
    TOWNHOUSE = "townhouse"
    STUDIO = "studio"
    ROOM = "room"
    COMMERCIAL = "commercial"


class PropertyStatus(str, Enum):
    AVAILABLE = "available"
    RENTED = "rented"
    PENDING = "pending"
    MAINTENANCE = "maintenance"
    INACTIVE = "inactive"


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    property_type = Column(String, nullable=False)
    status = Column(String, default=PropertyStatus.AVAILABLE)
    
    # Location details
    address = Column(String, nullable=False)
    city = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False, index=True)
    postal_code = Column(String, nullable=False)
    country = Column(String, nullable=False, default="Thailand")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Property details
    bedrooms = Column(Integer, nullable=False, default=0)
    bathrooms = Column(Float, nullable=False, default=0)
    square_feet = Column(Integer, nullable=True)
    lot_size = Column(Float, nullable=True)
    year_built = Column(Integer, nullable=True)
    floor_number = Column(Integer, nullable=True)
    total_floors = Column(Integer, nullable=True)
    
    # Pricing
    rent_price = Column(Float, nullable=False)
    security_deposit = Column(Float, nullable=True)
    
    # Compatibility alias for frontend
    @property
    def monthly_rent(self):
        return self.rent_price
    
    # Features
    is_furnished = Column(Boolean, default=False)
    pets_allowed = Column(Boolean, default=False)
    smoking_allowed = Column(Boolean, default=False)
    parking_available = Column(Boolean, default=False)
    utilities_included = Column(Boolean, default=False)
    
    # Lease terms
    min_lease_term = Column(Integer, nullable=True)  # in months
    max_lease_term = Column(Integer, nullable=True)  # in months
    available_from = Column(DateTime, nullable=True)
    
    # Meta
    views_count = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="properties")
    photos = relationship("PropertyPhoto", back_populates="property", cascade="all, delete-orphan")
    amenities = relationship("PropertyAmenity", back_populates="property", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Property(id={self.id}, title={self.title}, city={self.city})>"