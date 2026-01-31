"""Pydantic schemas for calendar events."""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class EventBase(BaseModel):
    """Base event schema."""

    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None

    # Date/time fields
    start_time: datetime
    end_time: datetime
    all_day: bool = False

    # Location
    location: Optional[str] = None

    # Recurrence
    recurrence_rule: Optional[str] = None  # RRULE format (e.g., "FREQ=DAILY;COUNT=5")

    # Status and type
    status: str = "confirmed"  # confirmed, tentative, cancelled
    event_type: Optional[str] = None  # meeting, appointment, reminder, etc.

    # Color coding
    color: Optional[str] = None  # hex color like "#FF5733" or color name

    # Tags and categories
    tags: Optional[List[str]] = []

    # Attendees
    attendees: Optional[List[dict]] = []  # [{"name": "John", "email": "john@example.com"}]

    # Reminders
    reminders: Optional[List[dict]] = []  # [{"minutes_before": 30, "method": "notification"}]


class EventCreate(EventBase):
    """Schema for creating a new event."""

    pass


class EventUpdate(BaseModel):
    """Schema for updating an event (all fields optional)."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    all_day: Optional[bool] = None
    location: Optional[str] = None
    recurrence_rule: Optional[str] = None
    status: Optional[str] = None
    event_type: Optional[str] = None
    color: Optional[str] = None
    tags: Optional[List[str]] = None
    attendees: Optional[List[dict]] = None
    reminders: Optional[List[dict]] = None


class Event(EventBase):
    """Complete event schema with all fields."""

    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
