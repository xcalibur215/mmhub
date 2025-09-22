from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from db.base import Base


class PropertyPhoto(Base):
    __tablename__ = "property_photos"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    url = Column(String, nullable=False)
    alt_text = Column(String, nullable=True)
    caption = Column(String, nullable=True)
    display_order = Column(Integer, default=0)
    is_primary = Column(Boolean, default=False)
    file_size = Column(Integer, nullable=True)  # in bytes
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    property = relationship("Property", back_populates="photos")

    def __repr__(self):
        return f"<PropertyPhoto(id={self.id}, property_id={self.property_id}, url={self.url})>"
