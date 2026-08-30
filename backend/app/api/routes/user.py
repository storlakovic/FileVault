from fastapi import APIRouter

from app.api.dependencies.auth import CurrentUser
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter(
    tags=["User Endpoint"]
)

@router.get("/users")
def get_all_users():
    return {
        "message": "All users"
    }

@router.get(
    "/users/me",
    response_model=UserResponse,
)
def get_current_user_profile(
    current_user: CurrentUser,
) -> User:
    return current_user