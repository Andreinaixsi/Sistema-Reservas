from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.modules.resources.model import Resource

class ResourceService:
    @staticmethod
    def get_resource(db: Session, resource_id: int) -> Resource:
        return db.query(Resource).filter(Resource.id == resource_id).first()

    @staticmethod
    def list_resources(db: Session, organization_id: int) -> list[Resource]:
        return db.query(Resource).filter(Resource.organization_id == organization_id, Resource.is_active == True).all()

    @staticmethod
    def create_resource(db: Session, org_id: int, name: str, description: str = None, capacity: int = None) -> Resource:
        resource = Resource(
            organization_id=org_id,
            name=name,
            description=description,
            capacity=capacity,
            is_active=True
        )
        db.add(resource)
        db.commit()
        db.refresh(resource)
        return resource

    @staticmethod
    def update_resource(db: Session, resource_id: int, **kwargs) -> Resource:
        resource = db.query(Resource).filter(Resource.id == resource_id).first()
        if not resource:
            raise HTTPException(status_code=404, detail="Recurso no encontrado")
            
        for k, v in kwargs.items():
            setattr(resource, k, v)
                
        db.commit()
        db.refresh(resource)
        return resource
