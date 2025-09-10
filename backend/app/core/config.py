import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Basic settings
    APP_NAME: str = "PKU AI Workflow Platform"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database settings
    DATABASE_URL: str = "sqlite:///./app.db"
    
    # Security settings
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # CORS settings
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # File upload settings
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # RAG settings
    EMBEDDINGS_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    VECTOR_STORE_PATH: str = "./vector_store"
    
    # API settings
    API_V1_STR: str = "/api"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()