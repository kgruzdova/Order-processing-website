from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class AdminUserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=128)
    password: str = Field(min_length=8, max_length=72)

    @field_validator("username")
    @classmethod
    def username_strip(cls, v: str) -> str:
        s = v.strip()
        if len(s) < 3:
            raise ValueError("username too short")
        return s


class AdminUserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=128)
    password: str | None = Field(default=None, min_length=8, max_length=72)

    @field_validator("username")
    @classmethod
    def username_strip(cls, v: str | None) -> str | None:
        if v is None:
            return None
        s = v.strip()
        if len(s) < 3:
            raise ValueError("username too short")
        return s


class AdminUserRead(BaseModel):
    id: int
    username: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegistrationOpenResponse(BaseModel):
    registration_open: bool
