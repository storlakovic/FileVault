from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import or_, select

from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserCreate





class UserAlreadyExistsError(Exception):
    pass


def create_user(db: Session, user_data: UserCreate) -> User:
    statement = select(User).where(
        or_(
            User.email == user_data.email,
            User.username == user_data.username,
        )
    )

    existing_user = db.scalar(statement)

    if existing_user is not None:
        raise UserAlreadyExistsError()

    hashed_password = hash_password(user_data.password)

    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password
    )

    db.add(user)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise UserAlreadyExistsError()

    db.refresh(user)

    return user

