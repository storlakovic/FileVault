from datetime import datetime

from pydantic import BaseModel, ConfigDict


class StoredFileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    original_name: str
    content_type: str
    size: int
    created_at: datetime