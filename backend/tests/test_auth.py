def test_root_endpoint(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["message"] == (
        "FileVault API läuft"
    )


def test_protected_endpoint_requires_token(client):
    response = client.get(
        "/api/v1/users/me"
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid or expired token"
    }


def test_registration_returns_safe_user(
    registered_user,
    user_payload,
):
    assert registered_user["username"] == (
        user_payload["username"]
    )
    assert registered_user["email"] == (
        user_payload["email"]
    )
    assert registered_user["is_active"] is True
    assert "password" not in registered_user
    assert "password_hash" not in registered_user


def test_duplicate_registration_returns_conflict(
    client,
    registered_user,
    user_payload,
):
    assert registered_user["username"] == (
        user_payload["username"]
    )

    response = client.post(
        "/api/v1/auth/register",
        json=user_payload,
    )

    assert response.status_code == 409
    assert response.json() == {
        "detail": "Username or email already registered"
    }


def test_login_with_wrong_password_returns_unauthorized(
    client,
    registered_user,
    user_payload,
):
    assert registered_user["username"] == (
        user_payload["username"]
    )

    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": user_payload["username"],
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid credentials"
    }


def test_current_user_with_valid_token(
    client,
    auth_headers,
    user_payload,
):
    response = client.get(
        "/api/v1/users/me",
        headers=auth_headers,
    )

    assert response.status_code == 200

    current_user = response.json()

    assert current_user["username"] == (
        user_payload["username"]
    )
    assert current_user["email"] == (
        user_payload["email"]
    )
    assert current_user["is_active"] is True
    assert "password_hash" not in current_user


def test_invalid_token_returns_unauthorized(client):
    response = client.get(
        "/api/v1/users/me",
        headers={
            "Authorization": "Bearer invalid-token"
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid or expired token"
    }

import pytest


def test_unknown_user_cannot_login(client):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "unknown",
            "password": "securepassword",
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid credentials"
    }


@pytest.mark.parametrize(
    "payload",
    [
        {
            "username": "ab",
            "email": "test@example.com",
            "password": "securepassword",
        },
        {
            "username": "testuser",
            "email": "not-an-email",
            "password": "securepassword",
        },
        {
            "username": "testuser",
            "email": "test@example.com",
            "password": "short",
        },
    ],
)
def test_invalid_registration_data_returns_422(
    client,
    payload,
):
    response = client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert response.status_code == 422