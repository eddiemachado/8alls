"""Task API routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.core.database import get_db
from app.models.task import Task as TaskModel
from app.schemas.task import Task, TaskCreate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=List[Task])
def get_tasks(db: Session = Depends(get_db)):
    """Get all tasks."""
    tasks = db.query(TaskModel).all()
    return tasks


@router.get("/{task_id}", response_model=Task)
def get_task(task_id: str, db: Session = Depends(get_db)):
    """Get a specific task by ID."""
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("", response_model=Task, status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task."""
    # Generate UUID for new task
    task_id = str(uuid.uuid4())

    # Create task model instance
    db_task = TaskModel(
        id=task_id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        priority=task.priority,
        due_date=task.due_date,
        tags=task.tags or []
    )

    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.put("/{task_id}", response_model=Task)
def update_task(task_id: str, task: TaskUpdate, db: Session = Depends(get_db)):
    """Update an existing task."""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update only provided fields
    update_data = task.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    db.commit()
    db.refresh(db_task)
    return db_task


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: str, db: Session = Depends(get_db)):
    """Delete a task."""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(db_task)
    db.commit()
    return None
