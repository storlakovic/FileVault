from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile,
    status,
)

from app.api.dependencies.auth import CurrentUser
from app.api.dependencies.database import DatabaseSession
from app.models.stored_file import StoredFile
from app.schemas.file import StoredFileResponse
from app.services.file_service import (
    FileTooLargeError,
    InvalidFilenameError,
    store_file, get_user_files,
)


router = APIRouter(
    prefix="/files",
    tags=["Files"],
)


@router.post(
    "",
    response_model=StoredFileResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_file(
    db: DatabaseSession,
    current_user: CurrentUser,
    file: UploadFile = File(...),
) -> StoredFile:
    try:
        return store_file(
            db=db,
            upload=file,
            owner_id=current_user.id,
        )

    except InvalidFilenameError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid filename",
        ) from exc

    except FileTooLargeError as exc:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File is too large",
        ) from exc

@router.get(
    "",
    response_model=list[StoredFileResponse],
)
def list_files(
    db: DatabaseSession,
    current_user: CurrentUser,
) -> list[StoredFile]:
    return get_user_files(
        db=db,
        owner_id=current_user.id,
    )