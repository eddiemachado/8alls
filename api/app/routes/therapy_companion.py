"""Therapy Companion Sync API routes.

Receives Living Context and Session Summary records from the iOS Therapy
Companion app and writes them as markdown files to the Obsidian vault
(when VAULT_PATH is configured).
"""
import os
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.living_context import LivingContext as LivingContextModel
from app.models.session_summary import SessionSummary as SessionSummaryModel
from app.schemas.therapy_companion import (
    LivingContext,
    LivingContextCreate,
    LivingContextSyncResponse,
    SessionSummary,
    SessionSummaryCreate,
    SessionSummarySyncResponse,
)

router = APIRouter(prefix="/therapy-companion", tags=["therapy-companion"])

VAULT_SUBDIR_LC = "Therapy Companion/Living Context"
VAULT_SUBDIR_SS = "Therapy Companion/Session Summaries"


# ── Vault file helpers ────────────────────────────────────────────────────────

def _vault_path() -> Optional[str]:
    """Return the configured vault root, or None if not set."""
    return settings.VAULT_PATH or None


def _unique_filename(folder: str, date_str: str) -> tuple[str, str]:
    """
    Return a (relative_vault_path, absolute_path) for a new dated file.
    Appends -2, -3, … if a file already exists for that date.
    """
    base = date_str
    candidate = f"{base}.md"
    abs_folder = folder
    counter = 2
    while os.path.exists(os.path.join(abs_folder, candidate)):
        candidate = f"{base}-{counter}.md"
        counter += 1
    return candidate, os.path.join(abs_folder, candidate)


def _write_vault_file(abs_path: str, content: str) -> None:
    """Write content to the vault, creating parent directories as needed."""
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    with open(abs_path, "w", encoding="utf-8") as f:
        f.write(content)


def _living_context_markdown(record: LivingContextModel) -> str:
    """Assemble markdown for a living context version."""
    ts = record.updated_at.isoformat() if record.updated_at else ""
    return (
        f"---\n"
        f"updated_at: {ts}\n"
        f"derived_from_session: {record.derived_from_session_id}\n"
        f"---\n\n"
        f"{record.content}\n"
    )


def _session_summary_markdown(record: SessionSummaryModel) -> str:
    """Assemble markdown for a session summary."""
    gen = record.generated_at.isoformat() if record.generated_at else ""
    covers = record.covers_sessions_up_to.isoformat() if record.covers_sessions_up_to else ""
    return (
        f"---\n"
        f"generated_at: {gen}\n"
        f"covers_sessions_up_to: {covers}\n"
        f"---\n\n"
        f"{record.content}\n"
    )


def _sync_to_vault(subdir: str, date_str: str, markdown: str) -> tuple[Optional[str], Optional[datetime]]:
    """
    Write markdown to the vault if VAULT_PATH is configured.
    Returns (relative_obsidian_path, synced_at) or (None, None).
    """
    vault = _vault_path()
    if not vault:
        return None, None

    abs_folder = os.path.join(vault, subdir)
    filename, abs_path = _unique_filename(abs_folder, date_str)
    _write_vault_file(abs_path, markdown)

    relative_path = f"{subdir}/{filename}"
    return relative_path, datetime.now(timezone.utc)


# ── Living Context ────────────────────────────────────────────────────────────

@router.post("/living-context", response_model=LivingContextSyncResponse, status_code=201)
def create_living_context(payload: LivingContextCreate, db: Session = Depends(get_db)):
    """
    Receive a new living context version from the iOS app and write it to the vault.
    Returns obsidian_path and synced_at for the iOS app to store back in SwiftData.
    """
    if db.query(LivingContextModel).filter(LivingContextModel.id == payload.id).first():
        raise HTTPException(status_code=409, detail="Living context version already synced")

    record = LivingContextModel(
        id=payload.id,
        content=payload.content,
        updated_at=payload.updated_at,
        derived_from_session_id=payload.derived_from_session_id,
    )
    db.add(record)
    db.flush()  # Populate record fields before generating markdown

    date_str = payload.updated_at.strftime("%Y-%m-%d")
    markdown = _living_context_markdown(record)
    obsidian_path, synced_at = _sync_to_vault(VAULT_SUBDIR_LC, date_str, markdown)

    record.obsidian_path = obsidian_path
    record.obsidian_synced = obsidian_path is not None
    record.synced_at = synced_at

    db.commit()
    db.refresh(record)

    return LivingContextSyncResponse(
        id=record.id,
        obsidian_path=record.obsidian_path,
        synced_at=record.synced_at,
    )


@router.get("/living-context", response_model=List[LivingContext])
def list_living_contexts(
    start_date: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    """Return all stored living context versions, newest first."""
    query = db.query(LivingContextModel)
    if start_date:
        query = query.filter(LivingContextModel.updated_at >= start_date)
    if end_date:
        query = query.filter(LivingContextModel.updated_at <= f"{end_date}T23:59:59")
    return query.order_by(LivingContextModel.updated_at.desc()).all()


@router.get("/living-context/{lc_id}", response_model=LivingContext)
def get_living_context(lc_id: str, db: Session = Depends(get_db)):
    """Get a single living context version by UUID."""
    record = db.query(LivingContextModel).filter(LivingContextModel.id == lc_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Living context not found")
    return record


# ── Session Summaries ─────────────────────────────────────────────────────────

@router.post("/summaries", response_model=SessionSummarySyncResponse, status_code=201)
def create_session_summary(payload: SessionSummaryCreate, db: Session = Depends(get_db)):
    """
    Receive a new session summary from the iOS app and write it to the vault.
    Returns obsidian_path and synced_at for the iOS app to store back in SwiftData.
    """
    if db.query(SessionSummaryModel).filter(SessionSummaryModel.id == payload.id).first():
        raise HTTPException(status_code=409, detail="Session summary already synced")

    record = SessionSummaryModel(
        id=payload.id,
        content=payload.content,
        generated_at=payload.generated_at,
        covers_sessions_up_to=payload.covers_sessions_up_to,
    )
    db.add(record)
    db.flush()

    date_str = payload.generated_at.strftime("%Y-%m-%d")
    markdown = _session_summary_markdown(record)
    obsidian_path, synced_at = _sync_to_vault(VAULT_SUBDIR_SS, date_str, markdown)

    record.obsidian_path = obsidian_path
    record.obsidian_synced = obsidian_path is not None
    record.synced_at = synced_at

    db.commit()
    db.refresh(record)

    return SessionSummarySyncResponse(
        id=record.id,
        obsidian_path=record.obsidian_path,
        synced_at=record.synced_at,
    )


@router.get("/summaries", response_model=List[SessionSummary])
def list_session_summaries(
    start_date: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    """Return all stored session summaries, newest first."""
    query = db.query(SessionSummaryModel)
    if start_date:
        query = query.filter(SessionSummaryModel.generated_at >= start_date)
    if end_date:
        query = query.filter(SessionSummaryModel.generated_at <= f"{end_date}T23:59:59")
    return query.order_by(SessionSummaryModel.generated_at.desc()).all()


@router.get("/summaries/{summary_id}", response_model=SessionSummary)
def get_session_summary(summary_id: str, db: Session = Depends(get_db)):
    """Get a single session summary by UUID."""
    record = db.query(SessionSummaryModel).filter(SessionSummaryModel.id == summary_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Session summary not found")
    return record
