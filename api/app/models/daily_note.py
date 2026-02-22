"""Daily Note database model."""
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
from app.core.database import Base


class DailyNote(Base):
    """Daily note model — one per calendar day."""

    __tablename__ = "daily_notes"

    date = Column(String, primary_key=True)  # YYYY-MM-DD
    title = Column(String, nullable=True)
    content = Column(Text, nullable=True)  # Assembled markdown, for Obsidian export
    sections = Column(JSON, nullable=True)  # {"tasks": "...", "calendar": "...", "notes": "..."}
    obsidian_path = Column(String, nullable=True)  # e.g. "Daily Notes/2026-02-22.md"
    obsidian_synced = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
