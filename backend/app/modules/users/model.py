from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relaciones
    memberships = relationship("OrganizationMember", back_populates="user", cascade="all, delete-orphan")
    reservations = relationship("Reservation", back_populates="user")
