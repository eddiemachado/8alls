"""Therapy Companion Pydantic schemas."""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Living Context ────────────────────────────────────────────────────────────

class LivingContextCreate(BaseModel):
    """Payload sent by the iOS app."""
    id: str
    content: str
    updated_at: datetime
    derived_from_session_id: str


class LivingContextSyncResponse(BaseModel):
    """Minimal response returned after a successful POST — iOS stores synced_at."""
    id: str
    obsidian_path: Optional[str]
    synced_at: Optional[datetime]


class LivingContext(BaseModel):
    """Full stored object returned by GET endpoints."""
    id: str
    content: str
    updated_at: datetime
    derived_from_session_id: str
    obsidian_path: Optional[str] = None
    obsidian_synced: bool
    synced_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Session Summary ───────────────────────────────────────────────────────────

class SessionSummaryCreate(BaseModel):
    """Payload sent by the iOS app."""
    id: str
    content: str
    generated_at: datetime
    covers_sessions_up_to: datetime


class SessionSummarySyncResponse(BaseModel):
    """Minimal response returned after a successful POST — iOS stores synced_at."""
    id: str
    obsidian_path: Optional[str]
    synced_at: Optional[datetime]


class SessionSummary(BaseModel):
    """Full stored object returned by GET endpoints."""
    id: str
    content: str
    generated_at: datetime
    covers_sessions_up_to: datetime
    obsidian_path: Optional[str] = None
    obsidian_synced: bool
    synced_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
