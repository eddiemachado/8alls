"""Task Pydantic schemas."""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class TaskBase(BaseModel):
    """Base task schema."""

    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: str  # 'low', 'medium', 'high'
    due_date: Optional[str] = None
    tags: Optional[List[str]] = None


class TaskCreate(TaskBase):
    """Schema for creating a task."""

    pass


class TaskUpdate(BaseModel):
    """Schema for updating a task."""

    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    tags: Optional[List[str]] = None


class Task(TaskBase):
    """Schema for task response."""

    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
