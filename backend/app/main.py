from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy.sql.annotation import Annotated
from starlette import status

from api.router import api_router
from core.config import settings
from db.session import get_db


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    debug=settings.debug,
    description="Secure file storage API",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_origin,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    api_router,
    prefix=settings.api_v1_prefix,
)


@app.get("/", tags=["root"])
def root() -> dict[str, str]:
    return {
        "message": "FileVault API läuft",
        "environment": settings.environment,
        "docs": "/docs",
    }
DatabaseSession = Annotated[Session, Depends(get_db)]
@app.get("/database")
def database_health_check(
    db: DatabaseSession,
) -> dict[str, str]:
    try:
        db.execute(text("SELECT 1"))

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable",
        ) from exc

    return {
        "status": "healthy",
        "database": "connected",
    }
