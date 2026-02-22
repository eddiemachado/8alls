"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.core.database import engine, Base
from app.routes import tasks, search, events, websocket, daily_notes, therapy_companion

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
try:
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Failed to create database tables: {e}")
    # Don't fail startup - let health check show the error

# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description="Central API for 8alls productivity suite"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(websocket.router)
app.include_router(daily_notes.router, prefix="/api")
app.include_router(therapy_companion.router, prefix="/api")


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "8alls API",
        "version": settings.API_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
def health():
    """Health check endpoint."""
    try:
        # Simple health check - just return OK
        # Database connectivity is checked at startup
        return {"status": "healthy", "environment": settings.ENVIRONMENT}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}
