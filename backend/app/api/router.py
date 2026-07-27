from fastapi import APIRouter

from api.routes.user import router as user_endpoint
from api.routes.auth import router as auth_router
from api.routes.health import router as health_endpoint

api_router = APIRouter()

api_router.include_router(health_endpoint)
api_router.include_router(user_endpoint)
api_router.include_router(auth_router)
