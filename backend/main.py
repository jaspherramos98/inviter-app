# File: backend/main.py
# Path: /inviter-app/backend/main.py
# Description: Main FastAPI application entry point with all routes and configurations

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import secrets

# Import your schemas (keep your existing schemas.py file as is)
from schemas import (
    UserCreate, UserResponse, InvitationCreate, InvitationResponse,
    ResponseCreate, ResponseUpdate, MessageCreate, DashboardAnalytics
)

# Initialize FastAPI app
app = FastAPI(
    title="Inviter API",
    description="Modern invitation management system",
    version="1.0.0"
)

# CORS middleware for web app access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== MOCK DATA STORE (for testing without database) ====================
# This replaces the database temporarily
mock_users = {}
mock_invitations = []
mock_tokens = {}

# ==================== HELPER FUNCTIONS ====================
def create_mock_token(user_id: str):
    """Create a mock authentication token"""
    token = f"mock-token-{secrets.token_hex(16)}"
    mock_tokens[token] = user_id
    return token

def get_current_user_mock(token: str):
    """Mock function to get current user from token"""
    # In real app, this would decode JWT and query database
    if token in mock_tokens:
        user_id = mock_tokens[token]
        return mock_users.get(user_id)
    return None

# ==================== BASIC ROUTES ====================
@app.get("/")
async def root():
    return {"message": "Welcome to Inviter API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }

# ==================== AUTH ROUTES ====================
@app.post("/auth/signup", response_model=UserResponse)
async def signup(user_data: UserCreate):
    """Create new user account"""
    # Check if user exists
    if user_data.email in mock_users:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create mock user
    user_id = len(mock_users) + 1
    mock_user = {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "created_at": datetime.utcnow()
    }
    mock_users[user_data.email] = mock_user
    
    # Generate token
    access_token = create_mock_token(user_data.email)
    
    return {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.post("/auth/login")
async def login(email: str, password: str):
    """Login with email and password"""
    # Mock login - accept any password for demo
    if email not in mock_users:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = mock_users[email]
    access_token = create_mock_token(email)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/auth/me")
async def get_current_user(authorization: str = None):
    """Get current user info"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user = get_current_user_mock(token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return user

# ==================== INVITATION ROUTES ====================
@app.post("/invitations", response_model=InvitationResponse)
async def create_invitation(invitation: InvitationCreate):
    """Create a new invitation"""
    # Create mock invitation
    new_invitation = {
        "id": len(mock_invitations) + 1,
        "title": invitation.title,
        "description": invitation.description,
        "event_type": invitation.event_type,
        "event_date": invitation.event_date,
        "location": invitation.location,
        "yes_text": invitation.yes_text,
        "no_text": invitation.no_text,
        "creator_id": 1,  # Mock user ID
        "expires_at": invitation.expires_at,
        "created_at": datetime.utcnow(),
        "total_sent": len(invitation.recipients),
        "total_yes": 0,
        "total_no": 0,
        "total_pending": len(invitation.recipients),
        "total_messages": 0
    }
    
    mock_invitations.append(new_invitation)
    return new_invitation

@app.get("/invitations", response_model=List[InvitationResponse])
async def get_invitations(status: Optional[str] = None):
    """Get all invitations for current user"""
    # Return mock invitations with some sample data
    if not mock_invitations:
        # Add some sample data
        sample_invitations = [
            {
                "id": 1,
                "title": "Team Standup - Project Kickoff",
                "description": "Weekly team sync to discuss project progress",
                "event_type": "meeting",
                "event_date": datetime.utcnow() + timedelta(days=2),
                "location": "Zoom Meeting",
                "yes_text": "I'll join",
                "no_text": "Can't make it",
                "creator_id": 1,
                "expires_at": datetime.utcnow() + timedelta(days=5),
                "created_at": datetime.utcnow() - timedelta(hours=2),
                "total_sent": 24,
                "total_yes": 15,
                "total_no": 3,
                "total_pending": 6,
                "total_messages": 5
            },
            {
                "id": 2,
                "title": "Sarah's Birthday Party",
                "description": "Come celebrate Sarah's 30th birthday!",
                "event_type": "birthday",
                "event_date": datetime.utcnow() - timedelta(days=10),
                "location": "123 Party Street",
                "yes_text": "Count me in!",
                "no_text": "Sorry, can't attend",
                "creator_id": 1,
                "expires_at": datetime.utcnow() - timedelta(days=5),
                "created_at": datetime.utcnow() - timedelta(days=20),
                "total_sent": 45,
                "total_yes": 38,
                "total_no": 4,
                "total_pending": 3,
                "total_messages": 0
            },
            {
                "id": 3,
                "title": "Q1 2025 Planning Session",
                "description": "Strategic planning for Q1",
                "event_type": "meeting",
                "event_date": datetime.utcnow() + timedelta(days=3),
                "location": "Conference Room A",
                "yes_text": "I'll attend",
                "no_text": "Can't make it",
                "creator_id": 1,
                "expires_at": datetime.utcnow() + timedelta(days=3),
                "created_at": datetime.utcnow() - timedelta(days=1),
                "total_sent": 12,
                "total_yes": 7,
                "total_no": 1,
                "total_pending": 4,
                "total_messages": 2
            }
        ]
        return sample_invitations
    
    return mock_invitations

@app.get("/invitations/{invitation_id}")
async def get_invitation_details(invitation_id: int):
    """Get detailed information about a specific invitation"""
    # Mock response
    return {
        "invitation": {
            "id": invitation_id,
            "title": "Team Meeting",
            "description": "Weekly sync",
            "event_type": "meeting",
            "event_date": datetime.utcnow() + timedelta(days=1),
            "total_sent": 10,
            "total_yes": 7,
            "total_no": 1,
            "total_pending": 2,
            "total_messages": 3,
            "created_at": datetime.utcnow() - timedelta(days=1)
        },
        "responses": [],
        "messages": [],
        "statistics": {
            "total_sent": 10,
            "total_responded": 8,
            "total_yes": 7,
            "total_no": 1,
            "total_viewed": 9,
            "response_rate": 80.0
        }
    }

# ==================== RESPONSE ROUTES (Public) ====================
@app.get("/respond/{response_link}")
async def get_response_page(response_link: str):
    """Get invitation details for response page (public endpoint)"""
    # Mock response
    return {
        "invitation": {
            "title": "Team Meeting",
            "description": "Join us for our weekly team sync",
            "event_date": datetime.utcnow() + timedelta(days=1),
            "location": "Zoom Meeting",
            "yes_text": "I'll join",
            "no_text": "Can't make it",
            "creator_name": "John Doe"
        },
        "recipient_name": "Jane Smith",
        "has_responded": False,
        "previous_answer": None
    }

@app.post("/respond/{response_link}")
async def submit_response(response_link: str, answer: str, message: Optional[str] = None):
    """Submit response to invitation (public endpoint)"""
    if answer not in ["yes", "no"]:
        raise HTTPException(status_code=400, detail="Answer must be 'yes' or 'no'")
    
    return {
        "status": "success",
        "message": "Thank you for your response!",
        "answer": answer
    }

# ==================== ANALYTICS ROUTES ====================
@app.get("/analytics/dashboard", response_model=DashboardAnalytics)
async def get_dashboard_analytics():
    """Get dashboard statistics for the current user"""
    # Mock analytics data
    return {
        "total_invitations": len(mock_invitations) if mock_invitations else 3,
        "total_responses_sent": 81,
        "response_rate": 87.5,
        "pending_responses": 10,
        "total_accepted": 65,
        "total_declined": 6,
        "unread_messages": 2,
        "recent_activity": {
            "last_week_invitations": 2,
            "last_week_responses": 15
        }
    }

# ==================== TEMPLATE ROUTES ====================
@app.get("/templates")
async def get_invitation_templates():
    """Get available invitation templates"""
    return [
        {
            "id": "meeting_virtual",
            "name": "Virtual Meeting",
            "category": "Professional",
            "preview": {
                "title": "Team Meeting",
                "description": "Join us for our weekly team sync",
                "yes_text": "I'll join",
                "no_text": "Can't make it"
            }
        },
        {
            "id": "birthday_party",
            "name": "Birthday Party",
            "category": "Social",
            "preview": {
                "title": "Birthday Celebration",
                "description": "You're invited to celebrate!",
                "yes_text": "Count me in!",
                "no_text": "Sorry, can't attend"
            }
        },
        {
            "id": "wedding",
            "name": "Wedding",
            "category": "Formal",
            "preview": {
                "title": "Wedding Invitation",
                "description": "We request the honor of your presence",
                "yes_text": "Joyfully accept",
                "no_text": "Regretfully decline"
            }
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)