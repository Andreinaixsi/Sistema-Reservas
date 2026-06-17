from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from app.database import Base

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(Integer, ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(String(20), default="active", nullable=False)  # active, cancelled, pending_approval
    cancellation_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relaciones
    resource = relationship("Resource", back_populates="reservations")
    user = relationship("User", back_populates="reservations")
