from fastapi import APIRouter

from api.endpoints.user_endpoint import router as user_endpoint
from api.dependencies.auth import router as auth_router

api_router = APIRouter()


api_router.include_router(user_endpoint)
api_router.include_router(auth_router)