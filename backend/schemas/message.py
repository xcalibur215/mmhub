from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from db.models.message import MessageType, MessageStatus
from db.models.thread import ThreadStatus
from schemas.user import UserSummary


# Message schemas
class MessageBase(BaseModel):
    content: str
    message_type: MessageType = MessageType.TEXT
    attachment_url: Optional[str] = None
    attachment_name: Optional[str] = None


class MessageCreate(MessageBase):
    thread_id: Optional[int] = None  # For new threads
    recipient_id: Optional[int] = None  # For direct messages


class MessageUpdate(BaseModel):
    content: str


class Message(MessageBase):
    id: int
    thread_id: int
    sender_id: int
    recipient_id: Optional[int] = None
    status: MessageStatus
    attachment_size: Optional[int] = None
    is_edited: bool
    edited_at: Optional[datetime] = None
    created_at: datetime
    read_at: Optional[datetime] = None
    sender: UserSummary

    class Config:
        from_attributes = True


# Thread schemas
class ThreadBase(BaseModel):
    subject: str
    property_id: Optional[int] = None


class ThreadCreate(ThreadBase):
    participant_ids: List[int] = []
    initial_message: Optional[str] = None


class ThreadUpdate(BaseModel):
    subject: Optional[str] = None
    status: Optional[ThreadStatus] = None


class Thread(ThreadBase):
    id: int
    status: ThreadStatus
    created_by: int
    created_at: datetime
    updated_at: datetime
    last_message_at: Optional[datetime] = None
    participants: List[UserSummary] = []
    latest_message: Optional[Message] = None
    unread_count: Optional[int] = 0

    class Config:
        from_attributes = True


class ThreadDetail(Thread):
    messages: List[Message] = []


# Conversation schemas for simplified messaging
class ConversationCreate(BaseModel):
    participant_id: int
    subject: str
    message: str
    property_id: Optional[int] = None


class ConversationSummary(BaseModel):
    thread_id: int
    other_user: UserSummary
    subject: str
    latest_message: Optional[str] = None
    latest_message_at: Optional[datetime] = None
    unread_count: int = 0
    property_id: Optional[int] = None