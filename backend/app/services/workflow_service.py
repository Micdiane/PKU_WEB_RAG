from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime

from app.models.models import Workflow, WorkflowExecution
from app.models.schemas import WorkflowCreate, WorkflowUpdate, WorkflowExecutionCreate

class WorkflowService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_workflows(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Workflow]:
        return self.db.query(Workflow).filter(
            Workflow.owner_id == user_id
        ).offset(skip).limit(limit).all()
    
    def get_workflow(self, workflow_id: int) -> Optional[Workflow]:
        return self.db.query(Workflow).filter(Workflow.id == workflow_id).first()
    
    def create_workflow(self, workflow: WorkflowCreate, user_id: int) -> Workflow:
        db_workflow = Workflow(
            name=workflow.name,
            description=workflow.description,
            config=workflow.config or {},
            owner_id=user_id
        )
        self.db.add(db_workflow)
        self.db.commit()
        self.db.refresh(db_workflow)
        return db_workflow
    
    def update_workflow(self, workflow_id: int, workflow_update: WorkflowUpdate) -> Workflow:
        db_workflow = self.get_workflow(workflow_id)
        if not db_workflow:
            return None
        
        update_data = workflow_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_workflow, field, value)
        
        self.db.commit()
        self.db.refresh(db_workflow)
        return db_workflow
    
    def delete_workflow(self, workflow_id: int) -> bool:
        db_workflow = self.get_workflow(workflow_id)
        if not db_workflow:
            return False
        
        self.db.delete(db_workflow)
        self.db.commit()
        return True
    
    def publish_workflow(self, workflow_id: int) -> str:
        """发布工作流为API"""
        db_workflow = self.get_workflow(workflow_id)
        if not db_workflow:
            return None
        
        # Generate unique API endpoint
        api_endpoint = f"/api/public/workflows/{workflow_id}/execute"
        db_workflow.is_published = True
        db_workflow.api_endpoint = api_endpoint
        
        self.db.commit()
        self.db.refresh(db_workflow)
        return api_endpoint
    
    def execute_workflow(self, workflow_id: int, execution_data: WorkflowExecutionCreate) -> WorkflowExecution:
        """执行工作流"""
        # Create execution record
        db_execution = WorkflowExecution(
            workflow_id=workflow_id,
            input_data=execution_data.input_data,
            status="running"
        )
        self.db.add(db_execution)
        self.db.commit()
        self.db.refresh(db_execution)
        
        try:
            # Simple workflow execution simulation
            # In a real implementation, this would process the workflow config
            workflow = self.get_workflow(workflow_id)
            result = self._process_workflow(workflow.config, execution_data.input_data)
            
            db_execution.output_data = result
            db_execution.status = "completed"
            db_execution.completed_at = datetime.utcnow()
            
        except Exception as e:
            db_execution.status = "failed"
            db_execution.error_message = str(e)
            db_execution.completed_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(db_execution)
        return db_execution
    
    def get_workflow_executions(self, workflow_id: int, skip: int = 0, limit: int = 100) -> List[WorkflowExecution]:
        return self.db.query(WorkflowExecution).filter(
            WorkflowExecution.workflow_id == workflow_id
        ).offset(skip).limit(limit).all()
    
    def _process_workflow(self, config: dict, input_data: dict) -> dict:
        """Simple workflow processing logic"""
        # This is a simplified implementation
        # In a real system, this would process the workflow nodes and connections
        
        if not config or not config.get("nodes"):
            return {"result": "No workflow configuration found", "input": input_data}
        
        # Process workflow nodes
        result = {"processed": True, "input": input_data, "nodes_processed": len(config.get("nodes", []))}
        
        # Add simple text processing if input contains text
        if "text" in input_data:
            result["processed_text"] = input_data["text"].upper()
        
        return result