"""Calendar event routes."""
import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.core.database import get_db
from app.models.event import Event as EventModel
from app.schemas.event import Event, EventCreate, EventUpdate

router = APIRouter(prefix="/events", tags=["events"])

# Import broadcast function (will be available after websocket module is imported)
async def broadcast_event_change(event_type: str, data: dict):
    """Broadcast event changes via WebSocket."""
    try:
        from app.routes.websocket import broadcast_event
        await broadcast_event(event_type, data)
    except ImportError:
        pass  # WebSocket not available


@router.get("", response_model=List[Event])
def get_events(
    start_date: Optional[datetime] = Query(None, description="Filter events starting from this date"),
    end_date: Optional[datetime] = Query(None, description="Filter events until this date"),
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    status: Optional[str] = Query(None, description="Filter by status (confirmed, tentative, cancelled)"),
    db: Session = Depends(get_db)
):
    """
    Get all calendar events with optional filters.

    Query parameters:
    - start_date: Return events that start on or after this date
    - end_date: Return events that end on or before this date
    - event_type: Filter by event type (meeting, appointment, etc.)
    - status: Filter by status (confirmed, tentative, cancelled)
    """
    query = db.query(EventModel)

    # Apply date range filters
    if start_date:
        query = query.filter(EventModel.end_time >= start_date)
    if end_date:
        query = query.filter(EventModel.start_time <= end_date)

    # Apply type and status filters
    if event_type:
        query = query.filter(EventModel.event_type == event_type)
    if status:
        query = query.filter(EventModel.status == status)

    # Order by start time
    events = query.order_by(EventModel.start_time.asc()).all()
    return events


@router.get("/{event_id}", response_model=Event)
def get_event(event_id: str, db: Session = Depends(get_db)):
    """Get a specific calendar event by ID."""
    event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("", response_model=Event, status_code=201)
async def create_event(
    event: EventCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create a new calendar event."""
    # Validate that end_time is after start_time
    if event.end_time <= event.start_time:
        raise HTTPException(
            status_code=400,
            detail="end_time must be after start_time"
        )

    # Generate unique ID
    event_id = str(uuid.uuid4())

    # Create event
    db_event = EventModel(id=event_id, **event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    # Broadcast event creation
    background_tasks.add_task(
        broadcast_event_change,
        "event_created",
        Event.from_orm(db_event).dict()
    )

    return db_event


@router.put("/{event_id}", response_model=Event)
async def update_event(
    event_id: str,
    event: EventUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Update a calendar event."""
    db_event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Update only provided fields
    update_data = event.dict(exclude_unset=True)

    # Validate time range if both are provided
    start_time = update_data.get("start_time", db_event.start_time)
    end_time = update_data.get("end_time", db_event.end_time)
    if end_time <= start_time:
        raise HTTPException(
            status_code=400,
            detail="end_time must be after start_time"
        )

    for key, value in update_data.items():
        setattr(db_event, key, value)

    db.commit()
    db.refresh(db_event)

    # Broadcast event update
    background_tasks.add_task(
        broadcast_event_change,
        "event_updated",
        Event.from_orm(db_event).dict()
    )

    return db_event


@router.delete("/{event_id}", status_code=204)
async def delete_event(
    event_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Delete a calendar event."""
    db_event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Broadcast event deletion
    background_tasks.add_task(
        broadcast_event_change,
        "event_deleted",
        {"id": event_id}
    )

    db.delete(db_event)
    db.commit()
    return None


@router.get("/date/{date}", response_model=List[Event])
def get_events_by_date(date: str, db: Session = Depends(get_db)):
    """
    Get all events for a specific date (YYYY-MM-DD format).

    Returns events that occur on or overlap with the specified date.
    """
    try:
        # Parse the date string
        target_date = datetime.fromisoformat(date)
        # Get start and end of the day
        day_start = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = target_date.replace(hour=23, minute=59, second=59, microsecond=999999)

        # Find events that overlap with this day
        events = db.query(EventModel).filter(
            and_(
                EventModel.start_time <= day_end,
                EventModel.end_time >= day_start
            )
        ).order_by(EventModel.start_time.asc()).all()

        return events
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
