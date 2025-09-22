from typing import Optional

from pydantic import BaseModel


# Token schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class RefreshToken(BaseModel):
    refresh_token: str


# Login schemas
class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict  # User info


# Password reset schemas
class PasswordResetRequest(BaseModel):
    email: str


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


# Change password schema
class PasswordChange(BaseModel):
    current_password: str
    new_password: str
