# File: backend/utils.py
# Path: /inviter-app/backend/utils.py
# Description: Utility functions for link generation, SMS sending, etc.

import secrets
import hashlib
from typing import Optional
import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

# Twilio configuration (for SMS sending)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
BASE_URL = os.getenv("BASE_URL", "https://invite.yourapp.com")

# Initialize Twilio client if credentials available
twilio_client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def generate_secure_link(invitation_id: int, recipient_phone: str) -> str:
    """
    Generate a secure, unique link for each recipient
    Uses cryptographic randomness for security
    """
    # Create unique identifier
    unique_data = f"{invitation_id}-{recipient_phone}-{secrets.token_hex(16)}"
    
    # Generate hash for URL (shorter than full token)
    link_hash = hashlib.sha256(unique_data.encode()).hexdigest()[:20]
    
    # Return full URL
    return f"{BASE_URL}/respond/{link_hash}"

def send_sms(phone_number: str, message: str) -> bool:
    """
    Send SMS using Twilio
    Returns True if successful, False otherwise
    """
    if not twilio_client:
        print(f"SMS to {phone_number}: {message}")  # Development mode
        return True
    
    try:
        message = twilio_client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        return True
    except Exception as e:
        print(f"Error sending SMS: {e}")
        return False

def format_phone_number(phone: str) -> str:
    """
    Format phone number to E.164 format
    Assumes US numbers if no country code provided
    """
    # Remove all non-numeric characters
    digits = ''.join(filter(str.isdigit, phone))
    
    # Add US country code if not present
    if len(digits) == 10:
        digits = '1' + digits
    
    # Add + prefix
    if not digits.startswith('+'):
        digits = '+' + digits
    
    return digits

def generate_invitation_summary(invitation_data: dict) -> str:
    """
    Generate a concise summary for SMS preview
    """
    title = invitation_data.get('title', 'Event')
    date = invitation_data.get('event_date')
    
    if date:
        date_str = date.strftime('%b %d, %Y at %I:%M %p')
        return f"{title} - {date_str}"
    
    return title
