from fastapi import HTTPException, status

class BookingConflictException(HTTPException):
    def __init__(self, detail: str = "Conflicto de horario: El recurso ya está reservado en el rango seleccionado"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)

class OrgAccessDeniedException(HTTPException):
    def __init__(self, detail: str = "Acceso denegado: No eres miembro de esta organización"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

class AdminRequiredException(HTTPException):
    def __init__(self, detail: str = "Acceso denegado: Se requieren permisos de administrador"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)
