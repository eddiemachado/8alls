"""Session Summary database model."""
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base


class SessionSummary(Base):
    """One summary record per therapy session. Append-only."""

    __tablename__ = "session_summaries"

    id = Column(String, primary_key=True)           # UUID from iOS
    content = Column(Text, nullable=False)
    generated_at = Column(DateTime(timezone=True), nullable=False)       # From iOS
    covers_sessions_up_to = Column(DateTime(timezone=True), nullable=False)  # From iOS
    obsidian_path = Column(String, nullable=True)   # e.g. "Therapy Companion/Session Summaries/2026-02-22.md"
    obsidian_synced = Column(Boolean, default=False, nullable=False)
    synced_at = Column(DateTime(timezone=True), nullable=True)           # When written to vault
    created_at = Column(DateTime(timezone=True), server_default=func.now())
