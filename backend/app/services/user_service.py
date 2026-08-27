from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserCreate


def create_user(db: Session, user_data: UserCreate) -> User:
    hashed_password = hash_password(user_data.password)
    user = User(username=user_data.username, email=user_data.email, password_hash=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user