from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.schemas import DocumentCreate, DocumentResponse, QueryRequest, QueryResponse
from app.services.document_service import DocumentService
from app.services.rag_service import RAGService
from app.services.auth_service import AuthService
from app.api.auth import oauth2_scheme

router = APIRouter()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user = auth_service.get_current_user(token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    return user

@router.get("/", response_model=List[DocumentResponse])
async def get_documents(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取用户的文档列表"""
    document_service = DocumentService(db)
    return document_service.get_user_documents(current_user.id, skip=skip, limit=limit)

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """上传文档"""
    document_service = DocumentService(db)
    return await document_service.upload_document(file, title, current_user.id)

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取特定文档详情"""
    document_service = DocumentService(db)
    document = document_service.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    if document.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return document

@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除文档"""
    document_service = DocumentService(db)
    document = document_service.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    if document.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    document_service.delete_document(document_id)
    return {"message": "Document deleted successfully"}

@router.post("/{document_id}/index")
async def index_document(
    document_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """索引文档以支持搜索"""
    document_service = DocumentService(db)
    document = document_service.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    if document.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    rag_service = RAGService(db)
    await rag_service.index_document(document_id)
    return {"message": "Document indexed successfully"}

@router.post("/query", response_model=QueryResponse)
async def query_documents(
    query: QueryRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """基于RAG的文档查询"""
    rag_service = RAGService(db)
    return await rag_service.query_documents(query.query, current_user.id, query.top_k)