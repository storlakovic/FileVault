from app.core.config import settings
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_password_is_hashed():
    password = "securepassword"

    hashed_password = hash_password(password)

    assert hashed_password != password


def test_correct_password_is_verified():
    password = "securepassword"
    hashed_password = hash_password(password)

    result = verify_password(
        password,
        hashed_password,
    )

    assert result is True


def test_wrong_password_is_rejected():
    hashed_password = hash_password(
        "securepassword"
    )

    result = verify_password(
        "wrongpassword",
        hashed_password,
    )

    assert result is False


def test_access_token_can_be_decoded():
    token = create_access_token("123")

    subject = decode_access_token(token)

    assert subject == "123"


def test_token_with_invalid_signature_is_rejected(
    monkeypatch,
):
    token = create_access_token("123")

    monkeypatch.setattr(
        settings,
        "jwt_secret_key",
        "different-test-secret-key-12345678901234567890",
    )

    subject = decode_access_token(token)

    assert subject is None


def test_expired_token_is_rejected(monkeypatch):
    monkeypatch.setattr(
        settings,
        "access_token_expire_minutes",
        -1,
    )

    token = create_access_token("123")
    subject = decode_access_token(token)

    assert subject is None