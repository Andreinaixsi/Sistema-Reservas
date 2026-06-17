from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import string
import secrets

from app.modules.users.model import User
from app.modules.organizations.model import Organization, OrganizationMember, OrganizationSettings
from app.modules.auth.utils import get_password_hash, verify_password

class AuthService:
    @staticmethod
    def register_user(db: Session, email: str, password: str, full_name: str) -> User:
        # Normalizar email
        email = email.strip().lower()
        
        # Verificar si ya existe
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
        
        # Crear usuario
        hashed_password = get_password_hash(password)
        new_user = User(
            email=email,
            password_hash=hashed_password,
            full_name=full_name
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def register_org_and_admin(
        db: Session,
        email: str,
        password: str,
        full_name: str,
        org_name: str,
        org_type: str = "otro",
        resource_label_singular: str = "Recurso",
        resource_label_plural: str = "Recursos"
    ) -> tuple[User, Organization]:
        # Normalizar email
        email = email.strip().lower()
        
        # Verificar si usuario ya existe
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
        
        # Crear usuario
        hashed_password = get_password_hash(password)
        new_user = User(
            email=email,
            password_hash=hashed_password,
            full_name=full_name
        )
        db.add(new_user)
        db.flush()  # Para obtener new_user.id
        
        # Generar código de invitación único
        invite_code = ""
        alphabet = string.ascii_uppercase + string.digits
        for _ in range(10):  # Límite de reintentos
            code = "".join(secrets.choice(alphabet) for _ in range(8))
            existing_org = db.query(Organization).filter(Organization.invite_code == code).first()
            if not existing_org:
                invite_code = code
                break
        if not invite_code:
            # Fallback seguro
            invite_code = secrets.token_hex(4).upper()
            
        # Crear organización
        new_org = Organization(
            name=org_name,
            type=org_type,
            invite_code=invite_code,
            resource_label_singular=resource_label_singular,
            resource_label_plural=resource_label_plural
        )
        db.add(new_org)
        db.flush()  # Para obtener new_org.id
        
        # Configurar reglas por defecto de la organización
        new_settings = OrganizationSettings(
            organization_id=new_org.id
        )
        db.add(new_settings)
        
        # Asociar usuario como administrador
        member_association = OrganizationMember(
            user_id=new_user.id,
            organization_id=new_org.id,
            role="admin"
        )
        db.add(member_association)
        
        db.commit()
        db.refresh(new_user)
        db.refresh(new_org)
        
        return new_user, new_org

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        email = email.strip().lower()
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        if not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        return user

