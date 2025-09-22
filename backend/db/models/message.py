from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from db.base import Base


class MessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    FILE = "file"
    SYSTEM = "system"


class MessageStatus(str, Enum):
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(Integer, ForeignKey("threads.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipient_id = Column(
        Integer, ForeignKey("users.id"), nullable=True
    )  # For direct messages
    content = Column(Text, nullable=False)
    message_type = Column(String, default=MessageType.TEXT)
    status = Column(String, default=MessageStatus.SENT)
    attachment_url = Column(String, nullable=True)
    attachment_name = Column(String, nullable=True)
    attachment_size = Column(Integer, nullable=True)
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime, nullable=True)

    # Relationships
    thread = relationship("Thread", back_populates="messages")
    sender = relationship(
        "User", foreign_keys=[sender_id], back_populates="sent_messages"
    )
    recipient = relationship(
        "User", foreign_keys=[recipient_id], back_populates="received_messages"
    )

    def __repr__(self):
        return f"<Message(id={self.id}, thread_id={self.thread_id}, sender_id={self.sender_id})>"
