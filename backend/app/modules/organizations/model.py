from datetime import time
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Time, func
from sqlalchemy.orm import relationship
from app.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50), default="otro") # condominio, universidad, empresa, centro_deportivo, otro
    invite_code = Column(String(50), unique=True, index=True, nullable=False)
    invite_code_enabled = Column(Boolean, default=True, nullable=False)
    resource_label_singular = Column(String(50), default="Recurso", nullable=False)
    resource_label_plural = Column(String(50), default="Recursos", nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relaciones
    members = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")
    settings = relationship("OrganizationSettings", back_populates="organization", uselist=False, cascade="all, delete-orphan")
    resources = relationship("Resource", back_populates="organization", cascade="all, delete-orphan")


class OrganizationMember(Base):
    __tablename__ = "organization_members"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), primary_key=True)
    role = Column(String(20), default="member", nullable=False) # admin, member
    created_at = Column(DateTime, server_default=func.now())

    # Relaciones
    user = relationship("User", back_populates="memberships")
    organization = relationship("Organization", back_populates="members")


class OrganizationSettings(Base):
    __tablename__ = "organization_settings"

    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), primary_key=True)
    max_days_ahead = Column(Integer, default=7, nullable=False)
    max_duration_minutes = Column(Integer, default=120, nullable=False)
    allowed_start_time = Column(Time, default=time(6, 0), nullable=False)
    allowed_end_time = Column(Time, default=time(22, 0), nullable=False)
    timezone = Column(String(50), default="UTC", nullable=False)

    # Relaciones
    organization = relationship("Organization", back_populates="settings")
