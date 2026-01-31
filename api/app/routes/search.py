"""Search API routes."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.task import Task as TaskModel
from app.schemas.task import Task

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=List[Task])
def search(
    q: str = Query(..., description="Search query"),
    db: Session = Depends(get_db)
):
    """Search across all tasks."""
    # Simple search in title and description
    tasks = db.query(TaskModel).filter(
        (TaskModel.title.contains(q)) |
        (TaskModel.description.contains(q))
    ).all()
    return tasks
