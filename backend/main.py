from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from pathlib import Path

# Import configuration
from app.core.config import settings

app = FastAPI(
    title="PKU AI Workflow Platform",
    description="AI 工作流平台 - 支持拖拽配置 AI 流程、文档知识检索、发布为 API 接口",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {
        "message": "PKU AI Workflow Platform API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Service is running"}

# Conditional imports to handle missing dependencies
try:
    from app.api import workflows, documents, auth
    from app.db.database import engine, Base
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # API routes
    app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
    app.include_router(workflows.router, prefix="/api/workflows", tags=["workflows"])
    app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
    
except ImportError as e:
    print(f"Warning: Some dependencies are missing: {e}")
    print("Running in minimal mode with basic endpoints only")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )