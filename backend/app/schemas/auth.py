from pydantic import BaseModel, EmailStr
from typing import Literal

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Literal["admin", "user"]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str