"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.routes import tasks, search

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description="Central API for 8alls productivity suite"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router, prefix="/api")
app.include_router(search.router, prefix="/api")


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
    return {"status": "healthy"}
