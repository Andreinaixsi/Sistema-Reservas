from datetime import datetime, time
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.modules.reservations.model import Reservation
from app.modules.resources.model import Resource
from app.modules.organizations.model import OrganizationSettings

class ReservationService:
    @staticmethod
    def get_reservation(db: Session, res_id: int) -> Reservation:
        return db.query(Reservation).filter(Reservation.id == res_id).first()

    @staticmethod
    def check_overlap(db: Session, resource_id: int, start_time: datetime, end_time: datetime, exclude_id: int = None) -> bool:
        query = db.query(Reservation).filter(
            Reservation.resource_id == resource_id,
            Reservation.status == "active",
            Reservation.start_time < end_time,
            Reservation.end_time > start_time
        )
        if exclude_id:
            query = query.filter(Reservation.id != exclude_id)
        return query.first() is not None

    @staticmethod
    def create_reservation(db: Session, resource_id: int, user_id: int, start_time: datetime, end_time: datetime) -> Reservation:
        resource = db.query(Resource).filter(Resource.id == resource_id).first()
        if not resource:
            raise HTTPException(status_code=404, detail="Recurso no encontrado")
            
        org = resource.organization
        if not org or not org.settings:
            raise HTTPException(status_code=500, detail="Configuración de la organización no encontrada")
            
        settings = org.settings
        
        # Validar anticipación
        now = datetime.now()
        days_ahead = (start_time.date() - now.date()).days
        if days_ahead > settings.max_days_ahead:
            raise HTTPException(
                status_code=400,
                detail=f"No puedes reservar con más de {settings.max_days_ahead} días de anticipación"
            )
            
        # Validar que la fecha no sea en el pasado
        if start_time < now:
            raise HTTPException(
                status_code=400,
                detail="No se pueden hacer reservas en el pasado"
            )
            
        # Validar duración
        duration = (end_time - start_time).total_seconds() / 60
        if duration <= 0:
            raise HTTPException(
                status_code=400,
                detail="La hora de finalización debe ser posterior a la de inicio"
            )
        if duration > settings.max_duration_minutes:
            raise HTTPException(
                status_code=400,
                detail=f"La reserva excede la duración máxima permitida de {settings.max_duration_minutes} minutos"
            )
            
        # Validar horas permitidas
        t_start = start_time.time()
        t_end = end_time.time()
        if t_start < settings.allowed_start_time or t_end > settings.allowed_end_time:
            raise HTTPException(
                status_code=400,
                detail=f"Las reservas deben estar dentro del horario permitido: {settings.allowed_start_time.strftime('%H:%M')} - {settings.allowed_end_time.strftime('%H:%M')}"
            )
            
        # Validar solapamiento
        if ReservationService.check_overlap(db, resource_id, start_time, end_time):
            raise HTTPException(
                status_code=400,
                detail="Conflicto de horario: El recurso ya está reservado en ese horario"
            )
            
        # Crear reserva
        reservation = Reservation(
            resource_id=resource_id,
            user_id=user_id,
            start_time=start_time,
            end_time=end_time,
            status="active"
        )
        db.add(reservation)
        db.commit()
        db.refresh(reservation)
        return reservation

    @staticmethod
    def cancel_reservation(db: Session, reservation_id: int, user_id: int, is_admin: bool, reason: str = None) -> Reservation:
        reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
        if not reservation:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")
            
        # Verificar permisos
        if not is_admin and reservation.user_id != user_id:
            raise HTTPException(status_code=403, detail="No tienes permiso para cancelar esta reserva")
            
        reservation.status = "cancelled"
        if reason:
            reservation.cancellation_reason = reason
        db.commit()
        db.refresh(reservation)
        return reservation
