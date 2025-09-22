from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from db.base import Base


class PropertyAmenity(Base):
    __tablename__ = "property_amenities"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    amenity_id = Column(Integer, ForeignKey("amenities.id"), nullable=False)

    # Relationships
    property = relationship("Property", back_populates="amenity_links")
    amenity = relationship("Amenity")

    def __repr__(self):
        return f"<PropertyAmenity(property_id={self.property_id}, amenity_id={self.amenity_id})>"
