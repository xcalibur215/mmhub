from datetime import datetime
from enum import Enum
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from db.base import Base


class ThreadStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    CLOSED = "closed"


# Association table for many-to-many relationship between threads and users
thread_participants = Table(
    'thread_participants',
    Base.metadata,
    Column('thread_id', Integer, ForeignKey('threads.id'), primary_key=True),
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True)
)


class Thread(Base):
    __tablename__ = "threads"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, nullable=False)
    status = Column(String, default=ThreadStatus.ACTIVE)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)  # Optional property reference
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_message_at = Column(DateTime, nullable=True)

    # Relationships
    participants = relationship("User", secondary=thread_participants, back_populates="threads")
    messages = relationship("Message", back_populates="thread", cascade="all, delete-orphan")
    property = relationship("Property")
    creator = relationship("User", foreign_keys=[created_by])

    def __repr__(self):
        return f"<Thread(id={self.id}, subject={self.subject})>"