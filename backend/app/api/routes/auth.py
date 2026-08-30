from fastapi import APIRouter, status, HTTPException

from app.api.dependencies.database import DatabaseSession
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
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

@router.post("/login")
def login():
    return {
        "message": "User logged in"
    }
