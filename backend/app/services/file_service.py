from pathlib import Path
from typing import Optional
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.stored_file import StoredFile


class InvalidFilenameError(Exception):
    pass


class FileTooLargeError(Exception):
    pass


def store_file(
    db: Session,
    upload: UploadFile,
    owner_id: int,
) -> StoredFile:
    if not upload.filename:
        raise InvalidFilenameError()

    original_name = Path(
        upload.filename.replace("\\", "/")
    ).name

    if not original_name:
        raise InvalidFilenameError()

    storage_name = uuid4().hex
    storage_directory = Path(settings.storage_path)

    storage_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    destination = storage_directory / storage_name
    size = 0
    chunk_size = 1024 * 1024

    try:
        with destination.open("wb") as output:
            while True:
                chunk = upload.file.read(chunk_size)

                if not chunk:
                    break

                size += len(chunk)

                if size > settings.max_file_size_bytes:
                    raise FileTooLargeError()

                output.write(chunk)

    except Exception:
        destination.unlink(missing_ok=True)
        raise

    stored_file = StoredFile(
        owner_id=owner_id,
        original_name=original_name,
        storage_name=storage_name,
        content_type=(
            upload.content_type
            or "application/octet-stream"
        ),
        size=size,
    )

    db.add(stored_file)

    try:
        db.commit()
    except Exception:
        db.rollback()
        destination.unlink(missing_ok=True)
        raise

    db.refresh(stored_file)

    return stored_file

def get_user_files(
    db: Session,
    owner_id: int,
) -> list[StoredFile]:
    statement = (
        select(StoredFile)
        .where(StoredFile.owner_id == owner_id)
        .order_by(StoredFile.created_at.desc())
    )

    return list(
        db.scalars(statement).all()
    )

def download_user_file(
    db: Session,
    file_id: int,
    owner_id: int,
) -> Optional[StoredFile]:
    statement = select(StoredFile).where(
        StoredFile.id == file_id,
        StoredFile.owner_id == owner_id,
    )

    return db.scalar(statement)

def get_user_file(
        db: Session,
        file_id: int,
        owner_id: int,
) -> Optional[StoredFile]:
    statement = select(StoredFile).where(
        StoredFile.id == file_id,
        StoredFile.owner_id == owner_id,
    )

    return db.scalar(statement)

def delete_user_file(
    db: Session,
    file_id: int,
    owner_id: int,
) -> bool:
    stored_file = get_user_file(
        db=db,
        file_id=file_id,
        owner_id=owner_id,
    )

    if stored_file is None:
        return False

    destination = (
            settings.storage_path
            / stored_file.storage_name
    )

    db.delete(stored_file)

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    destination.unlink(missing_ok=True)

    return True