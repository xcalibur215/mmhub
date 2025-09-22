# Import all models to ensure they're registered with SQLAlchemy
from db.base import Base
from db.models.amenity import Amenity
from db.models.message import Message
from db.models.property import Property
from db.models.property_amenity import PropertyAmenity
from db.models.property_photo import PropertyPhoto
from db.models.thread import Thread
from db.models.user import User
from db.models.flag import Flag

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
    "Flag",
]
