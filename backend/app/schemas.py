from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


# Enums
class UserRole(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class ReservationStatus(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None


class UserResponse(UserBase):
    id: str
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[str] = None


# Sport Schemas
class SportBase(BaseModel):
    name: str
    description: Optional[str] = None


class SportCreate(SportBase):
    pass


class SportResponse(SportBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Court Schemas
class CourtBase(BaseModel):
    name: str
    description: Optional[str] = None
    sport_id: str
    location: str
    price_per_hour: float = Field(..., gt=0)
    capacity: int = Field(..., gt=0)
    image_url: Optional[str] = None


class CourtCreate(CourtBase):
    pass


class CourtUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sport_id: Optional[str] = None
    location: Optional[str] = None
    price_per_hour: Optional[float] = Field(None, gt=0)
    capacity: Optional[int] = Field(None, gt=0)
    is_active: Optional[bool] = None
    image_url: Optional[str] = None


class CourtResponse(CourtBase):
    id: str
    is_active: bool
    created_at: datetime
    sport: SportResponse
    
    class Config:
        from_attributes = True


# Reservation Schemas
class ReservationBase(BaseModel):
    court_id: str
    date: datetime
    start_time: datetime
    end_time: datetime
    notes: Optional[str] = None


class ReservationCreate(ReservationBase):
    pass


class ReservationResponse(ReservationBase):
    id: str
    user_id: str
    total_price: float
    status: ReservationStatus
    created_at: datetime
    
    class Config:
        from_attributes = True


class ReservationWithDetails(ReservationResponse):
    court: CourtResponse
    user: UserResponse
    
    class Config:
        from_attributes = True
