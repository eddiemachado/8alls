"""Calendar Event model."""
from sqlalchemy import Column, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base


class Event(Base):
    """Calendar event model."""

    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # Date/time fields
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    all_day = Column(Boolean, default=False, nullable=False)

    # Location
    location = Column(String, nullable=True)

    # Recurrence (for repeating events)
    recurrence_rule = Column(String, nullable=True)  # RRULE format

    # Status and type
    status = Column(String, default="confirmed", nullable=False)  # confirmed, tentative, cancelled
    event_type = Column(String, nullable=True)  # meeting, appointment, reminder, etc.

    # Color coding (for visual categorization)
    color = Column(String, nullable=True)  # hex color or color name

    # Tags and categories
    tags = Column(JSON, nullable=True, default=list)

    # Attendees/participants (as JSON array)
    attendees = Column(JSON, nullable=True, default=list)

    # Reminders (as JSON array)
    reminders = Column(JSON, nullable=True, default=list)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
