import {apiBlobRequest, apiRequest} from "./api/client";

export interface StoredFileResponse {
    id: number;
    original_name: string;
    content_type: string;
    size: number;
    created_at: string;
}

export function uploadFile(
    file: File,
): Promise<StoredFileResponse> {
    const formData = new FormData();

    formData.append("file", file);

    return apiRequest<StoredFileResponse>(
        "/files",
        {
            method: "POST",
            body: formData,
        },
    );
}

export function getFiles(): Promise<StoredFileResponse[]> {
    return apiRequest<StoredFileResponse[]>(
        "/files",
        {
            method: "GET",
        },
    );
}

export function downloadFile(
    fileId: number,
): Promise<Blob> {
    return apiBlobRequest(
        `/files/${fileId}/download`,
        {
            method: "GET",
        },
    );
}

export function deleteFile(
    fileId: number,
): Promise<Blob> {
    return apiRequest(
        `/files/${fileId}`,
        {
            method: "DELETE",
        },
    );
}