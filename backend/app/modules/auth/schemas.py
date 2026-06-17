from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="La contraseña debe tener al menos 6 caracteres")
    full_name: str = Field(..., min_length=1, max_length=100)

class OrgCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str = Field("otro", description="condominio, universidad, empresa, centro_deportivo, otro")
    resource_label_singular: Optional[str] = "Recurso"
    resource_label_plural: Optional[str] = "Recursos"

class OrgRegisterRequest(BaseModel):
    user: UserCreate
    organization: OrgCreateRequest

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class OrgResponse(BaseModel):
    id: int
    name: str
    type: str
    invite_code: str
    resource_label_singular: str
    resource_label_plural: str
    created_at: datetime

    class Config:
        from_attributes = True

class OrgRegisterResponse(BaseModel):
    user: UserResponse
    organization: OrgResponse
    role: str = "admin"

class Token(BaseModel):
    access_token: str
    token_type: str
