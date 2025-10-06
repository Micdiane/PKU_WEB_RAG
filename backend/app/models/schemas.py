from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Workflow schemas
class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None

class WorkflowCreate(WorkflowBase):
    config: Optional[Dict[str, Any]] = None

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    is_published: Optional[bool] = None

class WorkflowResponse(WorkflowBase):
    id: int
    config: Optional[Dict[str, Any]] = None
    is_published: bool
    api_endpoint: Optional[str] = None
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Workflow execution schemas
class WorkflowExecutionCreate(BaseModel):
    input_data: Dict[str, Any]

class WorkflowExecutionResponse(BaseModel):
    id: int
    workflow_id: int
    input_data: Dict[str, Any]
    output_data: Optional[Dict[str, Any]] = None
    status: str
    error_message: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Document schemas
class DocumentBase(BaseModel):
    title: str

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: int
    filename: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    is_indexed: bool
    owner_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# RAG schemas
class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class QueryResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]
    confidence: float

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None