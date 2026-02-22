"""Daily Note Pydantic schemas."""
from pydantic import BaseModel, model_validator
from typing import Optional, Dict
from datetime import datetime


class DailyNoteBase(BaseModel):
    """Base daily note schema."""

    title: Optional[str] = None
    sections: Optional[Dict[str, str]] = None
    obsidian_path: Optional[str] = None
    obsidian_synced: bool = False


class DailyNoteCreate(DailyNoteBase):
    """Schema for creating a daily note."""

    date: str  # YYYY-MM-DD

    @model_validator(mode="after")
    def set_default_title(self) -> "DailyNoteCreate":
        if not self.title:
            self.title = f"Daily Note - {self.date}"
        return self


class DailyNoteUpdate(BaseModel):
    """Schema for full update (PUT) — all fields optional."""

    title: Optional[str] = None
    content: Optional[str] = None
    sections: Optional[Dict[str, str]] = None
    obsidian_path: Optional[str] = None
    obsidian_synced: Optional[bool] = None


class DailyNotePatch(BaseModel):
    """Schema for partial update (PATCH) — sections are merged, not replaced."""

    sections: Optional[Dict[str, str]] = None
    obsidian_path: Optional[str] = None
    obsidian_synced: Optional[bool] = None


class DailyNote(DailyNoteBase):
    """Schema for daily note response."""

    date: str
    content: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
