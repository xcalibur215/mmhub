from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship

from db.base import Base


class UserRole(str, Enum):
    USER = "user"
    LANDLORD = "landlord"
    AGENT = "agent"
    MODERATOR = "moderator"
    ADMIN = "admin"


class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING_VERIFICATION = "pending_verification"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, default=UserRole.USER)
    status = Column(String, default=UserStatus.ACTIVE)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    properties = relationship("Property", back_populates="owner")
    sent_messages = relationship(
        "Message", foreign_keys="Message.sender_id", back_populates="sender"
    )
    received_messages = relationship(
        "Message", foreign_keys="Message.recipient_id", back_populates="recipient"
    )
    # Many-to-many with threads via association table
    threads = relationship(
        "Thread",
        secondary="thread_participants",
        back_populates="participants",
        overlaps="creator",
    )

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"
