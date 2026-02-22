"""Living Context database model."""
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base


class LivingContext(Base):
    """One version of the living context per session update. Append-only."""

    __tablename__ = "living_contexts"

    id = Column(String, primary_key=True)           # UUID from iOS
    content = Column(Text, nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False)  # From iOS
    derived_from_session_id = Column(String, nullable=False)      # UUID of originating session
    obsidian_path = Column(String, nullable=True)   # e.g. "Therapy Companion/Living Context/2026-02-22.md"
    obsidian_synced = Column(Boolean, default=False, nullable=False)
    synced_at = Column(DateTime(timezone=True), nullable=True)    # When written to vault
    created_at = Column(DateTime(timezone=True), server_default=func.now())
