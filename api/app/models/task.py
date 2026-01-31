"""Task database model."""
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
from app.core.database import Base


class Task(Base):
    """Task model."""

    __tablename__ = "tasks"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    completed = Column(Boolean, default=False, nullable=False)
    priority = Column(String, nullable=False)  # 'low', 'medium', 'high'
    due_date = Column(String, nullable=True)  # ISO format string
    tags = Column(JSON, nullable=True)  # Array of strings
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
