import os

os.environ.setdefault(
    "DATABASE_URL",
    "sqlite://",
)
os.environ.setdefault(
    "JWT_SECRET_KEY",
    "e866eee44fdecc49f8cbe8ba82144c6b3010f10b628fbf35b2ad3cc3d0ac4954",
)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app

from app.models.stored_file import StoredFile
from app.models.user import User


test_engine = create_engine(
    "sqlite://",
    connect_args={
        "check_same_thread": False,
    },
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    bind=test_engine,
    autoflush=False,
    expire_on_commit=False,
)


def override_get_db():
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client(tmp_path):
    original_storage_path = settings.storage_path

    Base.metadata.create_all(
        bind=test_engine,
    )

    settings.storage_path = tmp_path

    app.dependency_overrides[get_db] = (
        override_get_db
    )

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
        settings.storage_path = original_storage_path

        Base.metadata.drop_all(
            bind=test_engine,
        )

@pytest.fixture
def user_payload():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "securepassword",
    }


@pytest.fixture
def registered_user(
    client,
    user_payload,
):
    response = client.post(
        "/api/v1/auth/register",
        json=user_payload,
    )

    assert response.status_code == 201

    return response.json()


@pytest.fixture
def access_token(
    client,
    user_payload,
    registered_user,
):
    assert registered_user["username"] == (
        user_payload["username"]
    )

    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": user_payload["username"],
            "password": user_payload["password"],
        },
    )

    assert response.status_code == 200

    token_data = response.json()

    assert token_data["token_type"] == "bearer"
    assert token_data["access_token"]

    return token_data["access_token"]


@pytest.fixture
def auth_headers(access_token):
    return {
        "Authorization": f"Bearer {access_token}"
    }