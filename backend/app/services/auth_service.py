from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session


from app.core.security import verify_password
from app.models.user import User
from app.schemas.auth import UserLogin


def authenticate_user(db: Session, user_data: UserLogin) -> User | None:

    statement = select(User).where(
        User.username == user_data.username
    )

    user = db.scalar(statement)

    if user is None:
        return None

    if not user.is_active:
        return None

    login_status = verify_password(user_data.password, user.password_hash)

    if not login_status:
        return None

    return user