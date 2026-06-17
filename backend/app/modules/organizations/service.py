from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import time

from app.modules.organizations.model import Organization, OrganizationMember, OrganizationSettings
from app.modules.users.model import User

class OrganizationService:
    @staticmethod
    def get_organization(db: Session, org_id: int) -> Organization:
        return db.query(Organization).filter(Organization.id == org_id).first()

    @staticmethod
    def add_member(db: Session, org_id: int, email: str, role: str = "member") -> OrganizationMember:
        email = email.strip().lower()
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado con ese correo electrónico"
            )
            
        # Verificar si ya pertenece a la organización
        existing = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == user.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El usuario ya pertenece a esta organización"
            )
            
        member = OrganizationMember(
            user_id=user.id,
            organization_id=org_id,
            role=role
        )
        db.add(member)
        db.commit()
        return member

    @staticmethod
    def update_settings(db: Session, org_id: int, settings_data: dict) -> OrganizationSettings:
        settings = db.query(OrganizationSettings).filter(OrganizationSettings.organization_id == org_id).first()
        if not settings:
            settings = OrganizationSettings(organization_id=org_id)
            db.add(settings)
            db.flush()
            
        if "max_days_ahead" in settings_data:
            settings.max_days_ahead = settings_data["max_days_ahead"]
        if "max_duration_minutes" in settings_data:
            settings.max_duration_minutes = settings_data["max_duration_minutes"]
        if "allowed_start_time" in settings_data:
            t_str = settings_data["allowed_start_time"]
            parts = [int(p) for p in t_str.split(":")]
            settings.allowed_start_time = time(*parts)
        if "allowed_end_time" in settings_data:
            t_str = settings_data["allowed_end_time"]
            parts = [int(p) for p in t_str.split(":")]
            settings.allowed_end_time = time(*parts)
        if "timezone" in settings_data:
            settings.timezone = settings_data["timezone"]
            
        db.commit()
        db.refresh(settings)
        return settings

    @staticmethod
    def join_by_invite_code(db: Session, user_id: int, invite_code: str) -> OrganizationMember:
        invite_code = invite_code.strip()
        org = db.query(Organization).filter(Organization.invite_code == invite_code).first()
        if not org:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Código de invitación inválido"
            )
            
        if not org.invite_code_enabled:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El registro por código de invitación está desactivado para esta organización"
            )
            
        # Verificar si ya es miembro
        existing = db.query(OrganizationMember).filter(
            OrganizationMember.organization_id == org.id,
            OrganizationMember.user_id == user_id
        ).first()
        if existing:
            return existing
            
        member = OrganizationMember(
            user_id=user_id,
            organization_id=org.id,
            role="member"
        )
        db.add(member)
        db.commit()
        return member
