from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Crear motor de base de datos
engine = create_engine(
    settings.DATABASE_URL,
    # pool_pre_ping ayuda a reconectar si Neon cierra conexiones inactivas
    pool_pre_ping=True
)

# Creador de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base para modelos declarativos
Base = declarative_base()
