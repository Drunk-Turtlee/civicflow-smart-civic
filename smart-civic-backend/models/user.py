from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class UserBase(BaseModel):
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "citizen"  # citizen | admin

class UserCreate(UserBase):
    google_id: Optional[str] = None

class UserInDB(UserBase):
    id: str = Field(..., alias="_id")
    google_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class UserResponse(UserBase):
    id: str
    created_at: datetime

class GoogleAuthRequest(BaseModel):
    credential: str  # Google OAuth ID Token

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
