"""Daily Notes API routes."""
from datetime import date as date_type
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.daily_note import DailyNote as DailyNoteModel
from app.models.task import Task as TaskModel
from app.models.event import Event as EventModel
from app.schemas.daily_note import (
    DailyNote,
    DailyNoteCreate,
    DailyNoteUpdate,
    DailyNotePatch,
)

router = APIRouter(prefix="/daily-notes", tags=["daily-notes"])


def _assemble_content(sections: dict) -> str:
    """Assemble sections dict into a full markdown string."""
    section_order = ["tasks", "calendar", "notes", "completed"]
    section_labels = {
        "tasks": "## Tasks",
        "calendar": "## Calendar",
        "notes": "## Notes",
        "completed": "## Completed",
    }
    parts = []
    # Render known sections in preferred order first
    for key in section_order:
        if key in sections and sections[key]:
            parts.append(f"{section_labels.get(key, f'## {key.title()}')}\n{sections[key]}")
    # Then any custom sections
    for key, value in sections.items():
        if key not in section_order and value:
            parts.append(f"## {key.title()}\n{value}")
    return "\n\n".join(parts)


def _build_today_sections(db: Session, today: str) -> dict:
    """Pre-populate sections from today's tasks and events."""
    tasks = db.query(TaskModel).filter(TaskModel.due_date == today).all()
    task_lines = "\n".join(
        f"- [{'x' if t.completed else ' '}] {t.title} @{t.priority}"
        for t in tasks
    ) or ""

    from datetime import datetime
    day_start = datetime.fromisoformat(f"{today}T00:00:00")
    day_end = datetime.fromisoformat(f"{today}T23:59:59")
    from sqlalchemy import and_
    events = (
        db.query(EventModel)
        .filter(
            and_(
                EventModel.start_time <= day_end,
                EventModel.end_time >= day_start,
            )
        )
        .order_by(EventModel.start_time.asc())
        .all()
    )
    event_lines = "\n".join(
        f"- {'All day' if e.all_day else e.start_time.strftime('%H:%M')}: {e.title}"
        for e in events
    ) or ""

    return {"tasks": task_lines, "calendar": event_lines, "notes": "", "completed": ""}


@router.get("", response_model=List[DailyNote])
def get_daily_notes(
    start_date: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    """List daily notes, ordered newest first. Optionally filter by date range."""
    query = db.query(DailyNoteModel)
    if start_date:
        query = query.filter(DailyNoteModel.date >= start_date)
    if end_date:
        query = query.filter(DailyNoteModel.date <= end_date)
    return query.order_by(DailyNoteModel.date.desc()).all()


@router.get("/today", response_model=DailyNote)
def get_today(db: Session = Depends(get_db)):
    """
    Get today's daily note. Auto-creates it (with tasks and events pre-populated)
    if it doesn't exist yet.
    """
    today = str(date_type.today())
    note = db.query(DailyNoteModel).filter(DailyNoteModel.date == today).first()
    if note:
        return note

    sections = _build_today_sections(db, today)
    content = _assemble_content(sections)
    note = DailyNoteModel(
        date=today,
        title=f"Daily Note - {today}",
        sections=sections,
        content=content,
        obsidian_synced=False,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.get("/{date}", response_model=DailyNote)
def get_daily_note(date: str, db: Session = Depends(get_db)):
    """Get a daily note by date (YYYY-MM-DD)."""
    note = db.query(DailyNoteModel).filter(DailyNoteModel.date == date).first()
    if not note:
        raise HTTPException(status_code=404, detail="Daily note not found")
    return note


@router.post("", response_model=DailyNote, status_code=201)
def create_daily_note(note: DailyNoteCreate, db: Session = Depends(get_db)):
    """Create a daily note for a specific date. Returns 409 if one already exists."""
    existing = db.query(DailyNoteModel).filter(DailyNoteModel.date == note.date).first()
    if existing:
        raise HTTPException(status_code=409, detail="Daily note already exists for this date")

    sections = note.sections or {}
    content = _assemble_content(sections) if sections else None

    db_note = DailyNoteModel(
        date=note.date,
        title=note.title,
        sections=sections,
        content=content,
        obsidian_path=note.obsidian_path,
        obsidian_synced=note.obsidian_synced,
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@router.put("/{date}", response_model=DailyNote)
def update_daily_note(date: str, note: DailyNoteUpdate, db: Session = Depends(get_db)):
    """Fully replace a daily note's fields."""
    db_note = db.query(DailyNoteModel).filter(DailyNoteModel.date == date).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Daily note not found")

    update_data = note.model_dump(exclude_unset=True)

    # If sections updated but content not explicitly set, reassemble content
    if "sections" in update_data and "content" not in update_data:
        update_data["content"] = _assemble_content(update_data["sections"])

    for field, value in update_data.items():
        setattr(db_note, field, value)

    db.commit()
    db.refresh(db_note)
    return db_note


@router.patch("/{date}", response_model=DailyNote)
def patch_daily_note(date: str, patch: DailyNotePatch, db: Session = Depends(get_db)):
    """
    Partially update a daily note.

    Sections are **merged** at the key level — only provided section keys are
    updated. Other sections are left untouched. This lets multiple apps each
    own different sections without overwriting each other.
    """
    db_note = db.query(DailyNoteModel).filter(DailyNoteModel.date == date).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Daily note not found")

    if patch.sections is not None:
        existing = dict(db_note.sections or {})
        existing.update(patch.sections)
        db_note.sections = existing
        db_note.content = _assemble_content(db_note.sections)

    if patch.obsidian_path is not None:
        db_note.obsidian_path = patch.obsidian_path

    if patch.obsidian_synced is not None:
        db_note.obsidian_synced = patch.obsidian_synced

    db.commit()
    db.refresh(db_note)
    return db_note


@router.delete("/{date}", status_code=204)
def delete_daily_note(date: str, db: Session = Depends(get_db)):
    """Delete a daily note."""
    db_note = db.query(DailyNoteModel).filter(DailyNoteModel.date == date).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Daily note not found")

    db.delete(db_note)
    db.commit()
    return None
