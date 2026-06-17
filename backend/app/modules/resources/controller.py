from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from app.common.dependencies import get_db, get_current_user
from app.modules.users.model import User
from app.modules.organizations.model import OrganizationMember
from app.modules.resources.service import ResourceService

router = APIRouter(prefix="/resources", tags=["Recursos"])

# --- Request Schemas ---
class ResourceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    capacity: Optional[int] = None

class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    capacity: Optional[int] = None
    is_active: Optional[bool] = None

# --- Endpoints ---

@router.get("/")
async def list_resources(
    organization_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not organization_id:
        if not current_user.memberships:
            return []
        organization_id = current_user.memberships[0].organization_id
        
    # Verificar pertenencia del usuario
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta organización")
        
    resources = ResourceService.list_resources(db, organization_id)
    return [
        {
            "id": r.id,
            "organization_id": r.organization_id,
            "name": r.name,
            "description": r.description,
            "capacity": r.capacity,
            "is_active": r.is_active
        } for r in resources
    ]

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_resource(
    res_data: ResourceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.memberships:
        raise HTTPException(status_code=400, detail="El usuario no pertenece a ninguna organización")
        
    membership = current_user.memberships[0]
    if membership.role != "admin":
        raise HTTPException(status_code=403, detail="Esta acción requiere rol de administrador")
        
    resource = ResourceService.create_resource(
        db,
        org_id=membership.organization_id,
        name=res_data.name,
        description=res_data.description,
        capacity=res_data.capacity
    )
    return {
        "id": resource.id,
        "organization_id": resource.organization_id,
        "name": resource.name,
        "description": resource.description,
        "capacity": resource.capacity,
        "is_active": resource.is_active
    }

@router.put("/{resource_id}")
async def update_resource(
    resource_id: int,
    res_data: ResourceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resource = ResourceService.get_resource(db, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Recurso no encontrado")
        
    # Verificar que el usuario sea administrador en la organización del recurso
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == resource.organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    if not membership or membership.role != "admin":
        raise HTTPException(status_code=403, detail="Esta acción requiere rol de administrador de la organización")
        
    updated = ResourceService.update_resource(db, resource_id, **res_data.model_dump(exclude_unset=True))
    return {
        "id": updated.id,
        "organization_id": updated.organization_id,
        "name": updated.name,
        "description": updated.description,
        "capacity": updated.capacity,
        "is_active": updated.is_active
    }

@router.delete("/{resource_id}")
async def delete_resource(
    resource_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resource = ResourceService.get_resource(db, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Recurso no encontrado")
        
    # Verificar que el usuario sea administrador
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == resource.organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    if not membership or membership.role != "admin":
        raise HTTPException(status_code=403, detail="Esta acción requiere rol de administrador de la organización")
        
    # Desactivación lógica (is_active = False)
    updated = ResourceService.update_resource(db, resource_id, is_active=False)
    return {"message": "Recurso eliminado con éxito", "id": updated.id}
