from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import string
import secrets

from app.common.dependencies import get_db, get_current_user
from app.modules.users.model import User
from app.modules.organizations.model import Organization, OrganizationMember, OrganizationSettings
from app.modules.organizations.service import OrganizationService

router = APIRouter(prefix="/organizations", tags=["Organizaciones"])

# --- Request Schemas ---
class SettingsUpdate(BaseModel):
    max_days_ahead: Optional[int] = None
    max_duration_minutes: Optional[int] = None
    allowed_start_time: Optional[str] = None
    allowed_end_time: Optional[str] = None
    timezone: Optional[str] = None

class NomenclatureUpdate(BaseModel):
    resource_label_singular: str
    resource_label_plural: str

class InviteMemberRequest(BaseModel):
    email: str

class JoinRequest(BaseModel):
    invite_code: str

class ToggleCodeRequest(BaseModel):
    enabled: bool

# --- Endpoints ---

@router.get("/")
async def list_organizations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orgs = []
    for membership in current_user.memberships:
        org = membership.organization
        orgs.append({
            "id": org.id,
            "name": org.name,
            "type": org.type,
            "invite_code": org.invite_code,
            "invite_code_enabled": org.invite_code_enabled,
            "resource_label_singular": org.resource_label_singular,
            "resource_label_plural": org.resource_label_plural,
            "role": membership.role
        })
    return orgs

@router.get("/{org_id}/settings")
async def get_settings(
    org_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar pertenencia
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta organización")
        
    settings = db.query(OrganizationSettings).filter(OrganizationSettings.organization_id == org_id).first()
    if not settings:
        settings = OrganizationSettings(organization_id=org_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
        
    return {
        "max_days_ahead": settings.max_days_ahead,
        "max_duration_minutes": settings.max_duration_minutes,
        "allowed_start_time": settings.allowed_start_time.isoformat() if settings.allowed_start_time else "08:00:00",
        "allowed_end_time": settings.allowed_end_time.isoformat() if settings.allowed_end_time else "22:00:00",
        "timezone": settings.timezone
    }

@router.put("/{org_id}/settings")
async def update_settings(
    org_id: int,
    settings_data: SettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar pertenencia y rol de admin
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta organización")
    if membership.role != "admin":
        raise HTTPException(status_code=403, detail="Esta acción requiere rol de administrador")
        
    updated = OrganizationService.update_settings(db, org_id, settings_data.model_dump(exclude_unset=True))
    return {
        "max_days_ahead": updated.max_days_ahead,
        "max_duration_minutes": updated.max_duration_minutes,
        "allowed_start_time": updated.allowed_start_time.isoformat() if updated.allowed_start_time else "08:00:00",
        "allowed_end_time": updated.allowed_end_time.isoformat() if updated.allowed_end_time else "22:00:00",
        "timezone": updated.timezone
    }

@router.put("/{org_id}/nomenclature")
async def update_nomenclature(
    org_id: int,
    nomenclature: NomenclatureUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar pertenencia y rol de admin
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta organización")
    if membership.role != "admin":
        raise HTTPException(status_code=403, detail="Esta acción requiere rol de administrador")
        
    org = OrganizationService.get_organization(db, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organización no encontrada")
        
    org.resource_label_singular = nomenclature.resource_label_singular
    org.resource_label_plural = nomenclature.resource_label_plural
    db.commit()
    db.refresh(org)
    
    return {
        "id": org.id,
        "name": org.name,
        "resource_label_singular": org.resource_label_singular,
        "resource_label_plural": org.resource_label_plural
    }

@router.get("/{org_id}/members")
async def list_members(
    org_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar pertenencia
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta organización")
        
    members = db.query(OrganizationMember).filter(OrganizationMember.organization_id == org_id).all()
    
    result = []
    for m in members:
        result.append({
            "user_id": m.user_id,
            "organization_id": m.organization_id,
            "email": m.user.email,
            "full_name": m.user.full_name,
            "role": m.role
        })
    return result

@router.post("/{org_id}/members", status_code=status.HTTP_201_CREATED)
async def add_member(
    org_id: int,
    invite_req: InviteMemberRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar pertenencia y rol de admin
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta organización")
    if membership.role != "admin":
        raise HTTPException(status_code=403, detail="Esta acción requiere rol de administrador")
        
    member = OrganizationService.add_member(db, org_id, invite_req.email)
    return {
        "user_id": member.user_id,
        "organization_id": member.organization_id,
        "email": member.user.email,
        "full_name": member.user.full_name,
        "role": member.role
    }

@router.post("/join", status_code=status.HTTP_201_CREATED)
async def join_org(
    join_req: JoinRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    member = OrganizationService.join_by_invite_code(db, current_user.id, join_req.invite_code)
    org = member.organization
    return {
        "organization_id": org.id,
        "name": org.name,
        "role": member.role
    }

@router.post("/{org_id}/regenerate-code")
async def regenerate_code(
    org_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar pertenencia y rol de admin
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta organización")
    if membership.role != "admin":
        raise HTTPException(status_code=403, detail="Esta acción requiere rol de administrador")
        
    org = OrganizationService.get_organization(db, org_id)
    
    # Generar código único
    invite_code = ""
    alphabet = string.ascii_uppercase + string.digits
    for _ in range(10):
        code = "".join(secrets.choice(alphabet) for _ in range(8))
        existing_org = db.query(Organization).filter(Organization.invite_code == code).first()
        if not existing_org:
            invite_code = code
            break
    if not invite_code:
        invite_code = secrets.token_hex(4).upper()
        
    org.invite_code = invite_code
    db.commit()
    db.refresh(org)
    
    return {
        "id": org.id,
        "invite_code": org.invite_code
    }

@router.put("/{org_id}/toggle-code")
async def toggle_code(
    org_id: int,
    toggle_req: ToggleCodeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar pertenencia y rol de admin
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == org_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="No tienes acceso a esta organización")
    if membership.role != "admin":
        raise HTTPException(status_code=403, detail="Esta acción requiere rol de administrador")
        
    org = OrganizationService.get_organization(db, org_id)
    org.invite_code_enabled = toggle_req.enabled
    db.commit()
    db.refresh(org)
    
    return {
        "id": org.id,
        "invite_code_enabled": org.invite_code_enabled
    }
