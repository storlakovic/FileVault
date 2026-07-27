from fastapi import APIRouter

router = APIRouter(
    tags=["User Endpoint"]
)

@router.get("/users")
def get_all_users():
    return {
        "message": "All users"
    }
