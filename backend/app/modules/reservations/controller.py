from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

from app.common.dependencies import get_db, get_current_user
from app.modules.users.model import User
from app.modules.organizations.model import OrganizationMember
from app.modules.resources.model import Resource
from app.modules.reservations.model import Reservation
from app.modules.reservations.service import ReservationService

router = APIRouter(prefix="/reservations", tags=["Reservas"])

# --- Request Schemas ---
class ReservationCreate(BaseModel):
    resource_id: int
    start_time: str
    end_time: str

class CancelRequest(BaseModel):
    reason: Optional[str] = None

# --- Endpoints ---

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_reservation(
    req: ReservationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        start_dt = datetime.fromisoformat(req.start_time.replace("Z", ""))
        end_dt = datetime.fromisoformat(req.end_time.replace("Z", ""))
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha/hora inválido. Usar ISO 8601")
        
    res = ReservationService.create_reservation(db, req.resource_id, current_user.id, start_dt, end_dt)
    return {
        "id": res.id,
        "resource_id": res.resource_id,
        "start_time": res.start_time.isoformat(),
        "end_time": res.end_time.isoformat(),
        "status": res.status
    }

@router.get("/mine")
async def list_my_reservations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reservations = db.query(Reservation).filter(
        Reservation.user_id == current_user.id
    ).order_by(Reservation.start_time.desc()).all()
    
    result = []
    for r in reservations:
        result.append({
            "id": r.id,
            "resource_id": r.resource_id,
            "resource_name": r.resource.name,
            "start_time": r.start_time.isoformat(),
            "end_time": r.end_time.isoformat(),
            "status": r.status,
            "created_at": r.created_at.isoformat()
        })
    return result

@router.patch("/{id}/cancel")
async def cancel_reservation(
    id: int,
    req: Optional[CancelRequest] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reservation = ReservationService.get_reservation(db, id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
        
    membership = db.query(OrganizationMember).filter(
        OrganizationMember.organization_id == reservation.resource.organization_id,
        OrganizationMember.user_id == current_user.id
    ).first()
    
    is_admin = membership.role == "admin" if membership else False
    reason = req.reason if req else None
    
    res = ReservationService.cancel_reservation(db, id, current_user.id, is_admin, reason)
    return {
        "id": res.id,
        "status": res.status,
        "cancellation_reason": res.cancellation_reason
    }

@router.get("/resources/{resource_id}/availability")
async def get_availability(
    resource_id: int,
    date: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Recurso no encontrado")
        
    org = resource.organization
    if not org or not org.settings:
        raise HTTPException(status_code=500, detail="Configuración de la organización no encontrada")
        
    try:
        parsed_date = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido. Usar YYYY-MM-DD")
        
    reservations = db.query(Reservation).filter(
        Reservation.resource_id == resource_id,
        Reservation.status == "active",
        func.date(Reservation.start_time) == parsed_date
    ).all()
    
    occupied = []
    for r in reservations:
        occupied.append({
            "id": r.id,
            "start": r.start_time.time().strftime("%H:%M"),
            "end": r.end_time.time().strftime("%H:%M"),
            "user_email": r.user.email
        })
        
    return {
        "resource_id": resource_id,
        "date": date,
        "occupied": occupied,
        "settings": {
            "max_days_ahead": org.settings.max_days_ahead,
            "max_duration_minutes": org.settings.max_duration_minutes,
            "allowed_start_time": org.settings.allowed_start_time.isoformat() if org.settings.allowed_start_time else "08:00:00",
            "allowed_end_time": org.settings.allowed_end_time.isoformat() if org.settings.allowed_end_time else "22:00:00",
            "timezone": org.settings.timezone
        }
    }
