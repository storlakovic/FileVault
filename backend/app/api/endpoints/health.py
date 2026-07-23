from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from db.session import get_db


router = APIRouter(
    prefix="/health",
    tags=["health"],
)

DatabaseSession = Annotated[Session, Depends(get_db)]


@router.get("")
def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
        "service": "filevault-backend",
    }


@router.get("/database")
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
