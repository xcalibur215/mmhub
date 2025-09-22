# Import all models to ensure they're registered with SQLAlchemy
from db.base import Base
from db.models.user import User
from db.models.property import Property
from db.models.amenity import Amenity
from db.models.property_photo import PropertyPhoto
from db.models.property_amenity import PropertyAmenity
from db.models.thread import Thread
from db.models.message import Message

# Export for easy importing
__all__ = [
    "Base",
    "User",
    "Property",
    "Amenity",
    "PropertyPhoto",
    "PropertyAmenity",
    "Thread",
    "Message",
]