from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from db.models.user import UserRole, UserStatus


# Base User schema
class UserBase(BaseModel):
    email: EmailStr
    username: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    role: UserRole = UserRole.USER
    bio: Optional[str] = None


# Schema for creating a user
class UserCreate(UserBase):
    password: str


# Schema for updating a user
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


# Schema for user response
class User(UserBase):
    id: int
    status: UserStatus
    avatar_url: Optional[str] = None
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


# Alias for response
UserResponse = User


# Token schema
class Token(BaseModel):
    access_token: str
    token_type: str


# Schema for user profile (public view)
class UserProfile(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    role: UserRole
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Schema for user summary (minimal info)
class UserSummary(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True