from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.common.dependencies import get_db
from app.modules.auth.schemas import (
    UserCreate,
    OrgRegisterRequest,
    UserLoginRequest,
    UserResponse,
    OrgRegisterResponse,
    Token
)
from app.modules.auth.service import AuthService
from app.modules.auth.utils import create_access_token

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = AuthService.register_user(
        db=db,
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name
    )
    return user

@router.post("/register-org", response_model=OrgRegisterResponse, status_code=status.HTTP_201_CREATED)
async def register_org(org_data: OrgRegisterRequest, db: Session = Depends(get_db)):
    user, org = AuthService.register_org_and_admin(
        db=db,
        email=org_data.user.email,
        password=org_data.user.password,
        full_name=org_data.user.full_name,
        org_name=org_data.organization.name,
        org_type=org_data.organization.type,
        resource_label_singular=org_data.organization.resource_label_singular,
        resource_label_plural=org_data.organization.resource_label_plural
    )
    return {"user": user, "organization": org, "role": "admin"}

@router.post("/login", response_model=Token)
async def login(login_data: UserLoginRequest, db: Session = Depends(get_db)):
    user = AuthService.authenticate_user(
        db=db,
        email=login_data.email,
        password=login_data.password
    )
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

