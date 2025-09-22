from sqlalchemy import Column, Integer, String, Boolean
from db.base import Base


class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, nullable=True)
    icon = Column(String, nullable=True)  # Icon name/class for frontend
    category = Column(String, nullable=True)  # e.g., "kitchen", "bathroom", "building", "outdoor"
    is_active = Column(Boolean, default=True)

    def __repr__(self):
        return f"<Amenity(id={self.id}, name={self.name})>"