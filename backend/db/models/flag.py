from datetime import datetime
from enum import Enum

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from db.base import Base


class FlagStatus(str, Enum):
    OPEN = "open"
    RESOLVED = "resolved"
    DISMISSED = "dismissed"


class FlagTarget(str, Enum):
    PROPERTY = "property"
    MESSAGE = "message"
    USER = "user"


class Flag(Base):
    __tablename__ = "flags"

    id = Column(Integer, primary_key=True, index=True)
    target_type = Column(String, nullable=False)  # one of FlagTarget
    target_id = Column(Integer, nullable=False)
    reason = Column(Text, nullable=False)

    status = Column(String, default=FlagStatus.OPEN)
    notes = Column(Text, nullable=True)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    creator = relationship("User", foreign_keys=[created_by])
    resolver = relationship("User", foreign_keys=[resolved_by])

    def __repr__(self):
        return f"<Flag(id={self.id}, target={self.target_type}:{self.target_id}, status={self.status})>"
