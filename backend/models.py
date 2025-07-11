# File: backend/models.py
# Path: /inviter-app/backend/models.py
# Description: SQLAlchemy database models for all entities

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, JSON, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class EventType(str, enum.Enum):
    """Enumeration for different event types"""
    CUSTOM = "custom"
    MEETING_VIRTUAL = "meeting_virtual"
    MEETING_PHYSICAL = "meeting_physical"
    BIRTHDAY = "birthday"
    WEDDING = "wedding"
    SOCIAL_GATHERING = "social_gathering"
    CONFERENCE = "conference"
    WORKSHOP = "workshop"

class User(Base):
    """User model for authentication and invitation creation"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=True)  # Nullable for OAuth users
    auth_provider = Column(String(50), default="email")  # email, google, apple
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    invitations = relationship("Invitation", back_populates="creator", cascade="all, delete-orphan")

class Invitation(Base):
    """Invitation model for storing invitation details"""
    __tablename__ = "invitations"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    event_type = Column(Enum(EventType), default=EventType.CUSTOM)
    event_date = Column(DateTime, nullable=True)
    location = Column(String(500), nullable=True)
    
    # Customization fields
    yes_text = Column(String(100), default="Yes")
    no_text = Column(String(100), default="No")
    template_style = Column(String(50), nullable=True)  # Template ID if used
    custom_fields = Column(JSON, nullable=True)  # Additional custom questions
    
    # Meta fields
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = relationship("User", back_populates="invitations")
    responses = relationship("Response", back_populates="invitation", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="invitation", cascade="all, delete-orphan")

class Response(Base):
    """Response model for tracking invitation responses"""
    __tablename__ = "responses"
    
    id = Column(Integer, primary_key=True, index=True)
    invitation_id = Column(Integer, ForeignKey("invitations.id"), nullable=False)
    
    # Recipient information
    recipient_name = Column(String(255), nullable=False)
    recipient_phone = Column(String(20), nullable=False)
    recipient_email = Column(String(255), nullable=True)  # Optional for future use
    
    # Response tracking
    response_link = Column(String(255), unique=True, nullable=False, index=True)  # Secure unique link
    answer = Column(String(10), nullable=True)  # yes, no, or null for pending
    custom_responses = Column(JSON, nullable=True)  # For custom field answers
    
    # Tracking fields
    viewed_at = Column(DateTime, nullable=True)
    responded_at = Column(DateTime, nullable=True)
    reminder_sent_at = Column(DateTime, nullable=True)
    
    # Relationships
    invitation = relationship("Invitation", back_populates="responses")
    messages = relationship("Message", back_populates="response", cascade="all, delete-orphan")

class Message(Base):
    """Message model for storing recipient messages/comments"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    invitation_id = Column(Integer, ForeignKey("invitations.id"), nullable=False)
    response_id = Column(Integer, ForeignKey("responses.id"), nullable=False)
    
    sender_name = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    invitation = relationship("Invitation", back_populates="messages")
    response = relationship("Response", back_populates="messages")