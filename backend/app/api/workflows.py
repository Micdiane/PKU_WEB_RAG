from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.schemas import (
    WorkflowCreate, WorkflowResponse, WorkflowUpdate, 
    WorkflowExecutionCreate, WorkflowExecutionResponse
)
from app.services.workflow_service import WorkflowService
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

@router.get("/", response_model=List[WorkflowResponse])
async def get_workflows(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取用户的工作流列表"""
    workflow_service = WorkflowService(db)
    return workflow_service.get_user_workflows(current_user.id, skip=skip, limit=limit)

@router.post("/", response_model=WorkflowResponse)
async def create_workflow(
    workflow: WorkflowCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建新的工作流"""
    workflow_service = WorkflowService(db)
    return workflow_service.create_workflow(workflow, current_user.id)

@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(
    workflow_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取特定工作流详情"""
    workflow_service = WorkflowService(db)
    workflow = workflow_service.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return workflow

@router.put("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: int,
    workflow_update: WorkflowUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新工作流"""
    workflow_service = WorkflowService(db)
    workflow = workflow_service.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return workflow_service.update_workflow(workflow_id, workflow_update)

@router.delete("/{workflow_id}")
async def delete_workflow(
    workflow_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除工作流"""
    workflow_service = WorkflowService(db)
    workflow = workflow_service.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    workflow_service.delete_workflow(workflow_id)
    return {"message": "Workflow deleted successfully"}

@router.post("/{workflow_id}/execute", response_model=WorkflowExecutionResponse)
async def execute_workflow(
    workflow_id: int,
    execution_data: WorkflowExecutionCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """执行工作流"""
    workflow_service = WorkflowService(db)
    workflow = workflow_service.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return workflow_service.execute_workflow(workflow_id, execution_data)

@router.post("/{workflow_id}/publish")
async def publish_workflow(
    workflow_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """发布工作流为 API"""
    workflow_service = WorkflowService(db)
    workflow = workflow_service.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    api_endpoint = workflow_service.publish_workflow(workflow_id)
    return {"message": "Workflow published successfully", "api_endpoint": api_endpoint}

@router.get("/{workflow_id}/executions", response_model=List[WorkflowExecutionResponse])
async def get_workflow_executions(
    workflow_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取工作流执行历史"""
    workflow_service = WorkflowService(db)
    workflow = workflow_service.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return workflow_service.get_workflow_executions(workflow_id, skip=skip, limit=limit)