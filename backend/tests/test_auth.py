import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.common.dependencies import get_db
from main import app

# Utilizar SQLite para las pruebas
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Reemplazar la dependencia get_db
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    # Crear tablas
    Base.metadata.create_all(bind=engine)
    yield
    # Limpiar tablas
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_register_user():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "password123",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
    assert "id" in data

def test_register_duplicate_user():
    user_data = {
        "email": "duplicate@example.com",
        "password": "password123",
        "full_name": "Duplicate User"
    }
    # Primer registro
    response1 = client.post("/api/v1/auth/register", json=user_data)
    assert response1.status_code == 201
    
    # Segundo registro con mismo email
    response2 = client.post("/api/v1/auth/register", json=user_data)
    assert response2.status_code == 400
    assert response2.json()["detail"] == "El email ya está registrado"

def test_register_org_and_admin():
    response = client.post(
        "/api/v1/auth/register-org",
        json={
            "user": {
                "email": "admin@example.com",
                "password": "adminpassword",
                "full_name": "Admin User"
            },
            "organization": {
                "name": "Test Org",
                "type": "universidad",
                "resource_label_singular": "Aula",
                "resource_label_plural": "Aulas"
            }
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "user" in data
    assert "organization" in data
    assert data["user"]["email"] == "admin@example.com"
    assert data["organization"]["name"] == "Test Org"
    assert data["organization"]["type"] == "universidad"
    assert data["organization"]["resource_label_singular"] == "Aula"
    assert data["organization"]["resource_label_plural"] == "Aulas"
    assert data["role"] == "admin"
    assert len(data["organization"]["invite_code"]) == 8

def test_login():
    # Registrar usuario
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@example.com",
            "password": "loginpassword",
            "full_name": "Login User"
        }
    )
    # Hacer login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "login@example.com",
            "password": "loginpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
