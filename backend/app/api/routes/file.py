from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile,
    status, Response
)
from fastapi.responses import FileResponse
from app.api.dependencies.auth import CurrentUser
from app.api.dependencies.database import DatabaseSession
from app.core.config import settings
from app.models.stored_file import StoredFile
from app.schemas.file import StoredFileResponse
from app.services.file_service import (
    FileTooLargeError,
    InvalidFilenameError,
    store_file, get_user_files, download_user_file, delete_user_file,
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

@router.get(
    "/{file_id}/download",
    response_class=FileResponse,
)
def download_file(
    file_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
):
    stored_file = download_user_file(
        db=db,
        file_id=file_id,
        owner_id=current_user.id,
    )

    if stored_file is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    file_path = (
        settings.storage_path
        / stored_file.storage_name
    )

    if not file_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    return FileResponse(
        path=file_path,
        media_type=stored_file.content_type,
        filename=stored_file.original_name,
    )

@router.delete(
    "/{file_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_file(
    file_id: int,
    db: DatabaseSession,
    current_user: CurrentUser,
) -> Response:
    deleted = delete_user_file(
        db=db,
        file_id=file_id,
        owner_id=current_user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )
