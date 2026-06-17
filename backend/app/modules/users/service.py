from sqlalchemy.orm import Session
from app.modules.users.model import User

class UserService:
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def update_user_profile(db: Session, user_id: int, full_name: str = None, email: str = None) -> User:
        # TODO: Implementar validación y actualización de perfil
        pass
