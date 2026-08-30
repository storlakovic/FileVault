from fastapi import APIRouter, status, HTTPException

from app.api.dependencies.database import DatabaseSession
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.auth import UserLogin, TokenResponse
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import authenticate_user
from app.services.user_service import create_user, UserAlreadyExistsError

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register",
             response_model=UserResponse,
             status_code=status.HTTP_201_CREATED,
)
def register(
    user_data: UserCreate,
    db: DatabaseSession,
) -> User:
    try:
        return create_user(
            db,
            user_data,
        )
    except UserAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already registered",
        ) from exc

@router.post("/login", response_model=TokenResponse,)
def login(
    user_data: UserLogin,
    db: DatabaseSession,
) -> TokenResponse:
    user = authenticate_user(
        db,
        user_data,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    access_token = create_access_token(
        str(user.id)
    )

    return TokenResponse(
        access_token=access_token,
    )
