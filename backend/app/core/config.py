from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "FileVault API"
    environment: Literal[
        "development",
        "testing",
        "production",
    ] = "development"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    database_url: str
    frontend_origin: str = "http://localhost:3000"

    jwt_secret_key: str
    jwt_algorithm: Literal["HS256"] = "HS256"
    access_token_expire_minutes: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )





@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
