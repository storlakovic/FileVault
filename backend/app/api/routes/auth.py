from fastapi import APIRouter, status

from app.api.dependencies.database import DatabaseSession
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import create_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register",
             response_model=UserResponse,
             status_code=status.HTTP_201_CREATED,
)
def register(user_data: UserCreate, db: DatabaseSession) -> User:
    return create_user(
        db,
        user_data,
    )

@router.post("/login")
def login():
    return {
        "message": "User logged in"
    }
