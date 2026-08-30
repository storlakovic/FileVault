from typing import Annotated, Optional, cast

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.api.dependencies.database import DatabaseSession
from app.core.security import decode_access_token
from app.models.user import User


bearer_scheme = HTTPBearer(auto_error=False)

BearerCredentials = Annotated[
    Optional[HTTPAuthorizationCredentials],
    Depends(bearer_scheme),
]


def get_current_user(
    db: DatabaseSession,
    credentials: BearerCredentials,
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token: str = credentials.credentials
    subject = decode_access_token(token)

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_id = int(subject)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    user = cast(
        Optional[User],
        db.get(User, user_id),
    )

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]