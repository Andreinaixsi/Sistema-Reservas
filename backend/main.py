import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine

# Registrar todos los modelos para SQLAlchemy
from app.modules.users.model import User
from app.modules.organizations.model import Organization, OrganizationMember, OrganizationSettings
from app.modules.resources.model import Resource
from app.modules.reservations.model import Reservation

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crear tablas en la base de datos si no existen
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="Sistema de Reservas Multi-Organización",
    description="API REST para el control y gestión de reservas de reservas compartidos",
    version="1.0.0",
    lifespan=lifespan,
)

# Configurar middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta raíz para verificar el estado de la API
@app.get("/", tags=["General"])
async def root():
    return {
        "status": "online",
        "message": "API del Sistema de Reservas Multi-Organización está activa",
        "docs_url": "/docs"
    }

# Registrar Routers
from app.modules.auth.controller import router as auth_router
from app.modules.users.controller import router as users_router
from app.modules.organizations.controller import router as org_router
from app.modules.resources.controller import router as resources_router
from app.modules.reservations.controller import router as reservations_router

api_v1_prefix = "/api/v1"
app.include_router(auth_router, prefix=api_v1_prefix)
app.include_router(users_router, prefix=api_v1_prefix)
app.include_router(org_router, prefix=api_v1_prefix)
app.include_router(resources_router, prefix=api_v1_prefix)
app.include_router(reservations_router, prefix=api_v1_prefix)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
