# File: backend/schemas.py
# Path: /inviter-app/backend/schemas.py
# Description: Pydantic schemas for request/response validation

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import phonenumbers

# ==================== USER SCHEMAS ====================

class UserCreate(BaseModel):
    """Schema for creating a new user"""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=255)
    password: Optional[str] = Field(None, min_length=6)  # Optional for OAuth
    auth_provider: str = Field("email", pattern="^(email|google|apple)$")

class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    email: str
    name: str
    access_token: str
    token_type: str = "bearer"
    
    class Config:
        from_attributes = True

# ==================== INVITATION SCHEMAS ====================
class RecipientInput(BaseModel):
    """Schema for invitation recipient"""
    name: str = Field(..., min_length=1)
    phone: str
    
    @field_validator('phone')
    def validate_phone(cls, v):
        try:
            parsed = phonenumbers.parse(v, None)
            if not phonenumbers.is_valid_number(parsed):
                raise ValueError("Invalid phone number")
            return v
        except phonenumbers.phonenumberutil.NumberParseException:
            raise ValueError("Invalid phone number format")


class InvitationCreate(BaseModel):
    """Schema for creating an invitation"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    event_type: str = Field("custom")
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    
    # Customization
    yes_text: Optional[str] = Field("Yes, I'll attend", max_length=100)
    no_text: Optional[str] = Field("Can't make it", max_length=100)
    template_style: Optional[str] = None
    custom_fields: Optional[Dict[str, Any]] = None
    
    # Recipients
    recipients: List[RecipientInput]
    expires_at: Optional[datetime] = None
    
    @field_validator('recipients')
    def validate_recipients(cls, v):
        if not v:
            raise ValueError('At least one recipient is required')
        if len(v) > 1000:  # Limit for safety
            raise ValueError('Maximum 1000 recipients allowed per invitation')
        return v
    
    @field_validator('expires_at')
    def validate_expiry(cls, v):
        if v and v <= datetime.utcnow():
            raise ValueError('Expiration date must be in the future')
        return v

class InvitationResponse(BaseModel):
    """Schema for invitation response"""
    id: int
    title: str
    description: Optional[str]
    event_type: str
    event_date: Optional[datetime]
    location: Optional[str]
    
    yes_text: str
    no_text: str
    
    creator_id: int
    expires_at: Optional[datetime]
    created_at: datetime
    
    # Statistics (added dynamically)
    total_sent: Optional[int] = 0
    total_yes: Optional[int] = 0
    total_no: Optional[int] = 0
    total_pending: Optional[int] = 0
    total_messages: Optional[int] = 0
    
    class Config:
        from_attributes = True

# ==================== RESPONSE SCHEMAS ====================

class ResponseCreate(BaseModel):
    """Schema for creating a response (internal use)"""
    invitation_id: int
    recipient_name: str
    recipient_phone: str
    response_link: str

class ResponseUpdate(BaseModel):
    """Schema for updating a response"""
    answer: str = Field(..., pattern="^(yes|no)$")
    message: Optional[str] = Field(None, max_length=1000)
    custom_responses: Optional[Dict[str, Any]] = None

class ResponseDetail(BaseModel):
    """Schema for response details"""
    id: int
    recipient_name: str
    recipient_phone: str
    answer: Optional[str]
    viewed_at: Optional[datetime]
    responded_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# ==================== MESSAGE SCHEMAS ====================

class MessageCreate(BaseModel):
    """Schema for creating a message"""
    content: str = Field(..., min_length=1, max_length=1000)

class MessageResponse(BaseModel):
    """Schema for message response"""
    id: int
    sender_name: str
    content: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== ANALYTICS SCHEMAS ====================

class DashboardAnalytics(BaseModel):
    """Schema for dashboard analytics"""
    total_invitations: int
    total_responses_sent: int
    response_rate: float
    pending_responses: int
    total_accepted: int
    total_declined: int
    unread_messages: int
    recent_activity: Dict[str, int]