from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.common.dependencies import get_db, get_current_user
from app.modules.users.model import User

router = APIRouter(prefix="/profile", tags=["Perfil de Usuario"])

@router.get("/")
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    membership = current_user.memberships[0] if current_user.memberships else None
    
    org_data = None
    role = None
    if membership:
        role = membership.role
        org = membership.organization
        org_data = {
            "id": org.id,
            "name": org.name,
            "type": org.type,
            "invite_code": org.invite_code,
            "invite_code_enabled": org.invite_code_enabled,
            "resource_label_singular": org.resource_label_singular,
            "resource_label_plural": org.resource_label_plural
        }
        if org.settings:
            org_data["settings"] = {
                "max_days_ahead": org.settings.max_days_ahead,
                "max_duration_minutes": org.settings.max_duration_minutes,
                "allowed_start_time": org.settings.allowed_start_time.isoformat() if org.settings.allowed_start_time else "08:00:00",
                "allowed_end_time": org.settings.allowed_end_time.isoformat() if org.settings.allowed_end_time else "22:00:00",
                "timezone": org.settings.timezone
            }
        else:
            org_data["settings"] = {
                "max_days_ahead": 7,
                "max_duration_minutes": 120,
                "allowed_start_time": "08:00:00",
                "allowed_end_time": "22:00:00",
                "timezone": "UTC"
            }
            
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": role,
        "organization": org_data
    }

@router.put("/")
async def update_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # TODO: Actualizar perfil del usuario autenticado si se requiere en el futuro
    return {"message": "Actualizar perfil (stub)", "id": current_user.id}

