from app.core.config import settings


def upload_test_file(
    client,
    auth_headers,
    filename="test.txt",
    content=b"FileVault test content",
):
    return client.post(
        "/api/v1/files",
        headers=auth_headers,
        files={
            "file": (
                filename,
                content,
                "text/plain",
            ),
        },
    )


def create_auth_headers(
    client,
    username,
    email,
):
    password = "securepassword"

    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "username": username,
            "email": email,
            "password": password,
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "username": username,
            "password": password,
        },
    )

    assert login_response.status_code == 200

    access_token = login_response.json()[
        "access_token"
    ]

    return {
        "Authorization": f"Bearer {access_token}",
    }


def test_upload_requires_authentication(client):
    response = client.post(
        "/api/v1/files",
        files={
            "file": (
                "test.txt",
                b"content",
                "text/plain",
            ),
        },
    )

    assert response.status_code == 401


def test_upload_file(
    client,
    auth_headers,
):
    content = b"FileVault test content"

    response = upload_test_file(
        client,
        auth_headers,
        content=content,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["original_name"] == "test.txt"
    assert data["content_type"] == "text/plain"
    assert data["size"] == len(content)
    assert "storage_name" not in data
    assert "owner_id" not in data

    stored_files = list(
        settings.storage_path.iterdir()
    )

    assert len(stored_files) == 1
    assert stored_files[0].read_bytes() == content


def test_list_own_files(
    client,
    auth_headers,
):
    upload_test_file(
        client,
        auth_headers,
        filename="document.txt",
    )

    response = client.get(
        "/api/v1/files",
        headers=auth_headers,
    )

    assert response.status_code == 200

    files = response.json()

    assert len(files) == 1
    assert files[0]["original_name"] == "document.txt"
    assert "storage_name" not in files[0]
    assert "owner_id" not in files[0]


def test_download_file(
    client,
    auth_headers,
):
    content = b"Download test content"

    upload_response = upload_test_file(
        client,
        auth_headers,
        filename="download.txt",
        content=content,
    )

    file_id = upload_response.json()["id"]

    response = client.get(
        f"/api/v1/files/{file_id}/download",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.content == content
    assert response.headers["content-type"].startswith(
        "text/plain"
    )
    assert "download.txt" in response.headers[
        "content-disposition"
    ]


def test_delete_file(
    client,
    auth_headers,
):
    upload_response = upload_test_file(
        client,
        auth_headers,
    )

    file_id = upload_response.json()["id"]

    assert any(settings.storage_path.iterdir())

    delete_response = client.delete(
        f"/api/v1/files/{file_id}",
        headers=auth_headers,
    )

    assert delete_response.status_code == 204
    assert delete_response.content == b""
    assert not any(settings.storage_path.iterdir())

    list_response = client.get(
        "/api/v1/files",
        headers=auth_headers,
    )

    assert list_response.json() == []


def test_missing_file_returns_not_found(
    client,
    auth_headers,
):
    download_response = client.get(
        "/api/v1/files/999/download",
        headers=auth_headers,
    )

    delete_response = client.delete(
        "/api/v1/files/999",
        headers=auth_headers,
    )

    assert download_response.status_code == 404
    assert delete_response.status_code == 404


def test_file_too_large_is_rejected(
    client,
    auth_headers,
    monkeypatch,
):
    monkeypatch.setattr(
        settings,
        "max_file_size_bytes",
        5,
    )

    response = upload_test_file(
        client,
        auth_headers,
        content=b"123456",
    )

    assert response.status_code == 413
    assert not any(settings.storage_path.iterdir())

    list_response = client.get(
        "/api/v1/files",
        headers=auth_headers,
    )

    assert list_response.json() == []


def test_user_cannot_access_another_users_file(
    client,
    auth_headers,
):
    upload_response = upload_test_file(
        client,
        auth_headers,
        filename="private.txt",
        content=b"private content",
    )

    file_id = upload_response.json()["id"]

    second_user_headers = create_auth_headers(
        client,
        username="seconduser",
        email="second@example.com",
    )

    list_response = client.get(
        "/api/v1/files",
        headers=second_user_headers,
    )

    download_response = client.get(
        f"/api/v1/files/{file_id}/download",
        headers=second_user_headers,
    )

    delete_response = client.delete(
        f"/api/v1/files/{file_id}",
        headers=second_user_headers,
    )

    assert list_response.status_code == 200
    assert list_response.json() == []
    assert download_response.status_code == 404
    assert delete_response.status_code == 404

    owner_response = client.get(
        f"/api/v1/files/{file_id}/download",
        headers=auth_headers,
    )

    assert owner_response.status_code == 200
    assert owner_response.content == b"private content"