from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from pathlib import Path
from fastapi import UploadFile

from app.models.models import Document
from app.models.schemas import DocumentCreate
from app.core.config import settings

class DocumentService:
    def __init__(self, db: Session):
        self.db = db
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.upload_dir.mkdir(exist_ok=True)
    
    def get_user_documents(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Document]:
        return self.db.query(Document).filter(
            Document.owner_id == user_id
        ).offset(skip).limit(limit).all()
    
    def get_document(self, document_id: int) -> Optional[Document]:
        return self.db.query(Document).filter(Document.id == document_id).first()
    
    async def upload_document(self, file: UploadFile, title: str, user_id: int) -> Document:
        # Validate file size
        if file.size > settings.MAX_FILE_SIZE:
            raise ValueError(f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE} bytes")
        
        # Create user-specific upload directory
        user_upload_dir = self.upload_dir / str(user_id)
        user_upload_dir.mkdir(exist_ok=True)
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{title}_{file.filename}"
        file_path = user_upload_dir / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Read file content for indexing
        content = ""
        try:
            if file.content_type and file.content_type.startswith("text/"):
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
        except Exception:
            # If we can't read as text, leave content empty
            pass
        
        # Create document record
        db_document = Document(
            title=title,
            filename=file.filename,
            content=content,
            file_path=str(file_path),
            file_size=file.size,
            mime_type=file.content_type,
            owner_id=user_id
        )
        
        self.db.add(db_document)
        self.db.commit()
        self.db.refresh(db_document)
        return db_document
    
    def delete_document(self, document_id: int) -> bool:
        db_document = self.get_document(document_id)
        if not db_document:
            return False
        
        # Delete file from filesystem
        if db_document.file_path and os.path.exists(db_document.file_path):
            os.remove(db_document.file_path)
        
        # Delete from database
        self.db.delete(db_document)
        self.db.commit()
        return True
    
    def get_document_content(self, document_id: int) -> Optional[str]:
        """Get the content of a document for indexing"""
        document = self.get_document(document_id)
        if not document:
            return None
        
        if document.content:
            return document.content
        
        # Try to read from file if content is not stored in DB
        if document.file_path and os.path.exists(document.file_path):
            try:
                with open(document.file_path, "r", encoding="utf-8") as f:
                    return f.read()
            except Exception:
                return None
        
        return None