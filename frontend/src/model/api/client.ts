import {ApiError} from "../errors/ApiError.ts";

const API_URL =
    import.meta.env.VITE_API_URL ??
    "http://localhost:8000/api/v1";


export async function apiRequest<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const headers = new Headers(options.headers);
    const token = localStorage.getItem("access_token");

    if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    if (token) {
        headers.set(
            "Authorization",
            `Bearer ${token}`,
        );
    }

    const response = await fetch(
        `${API_URL}${path}`,
        {
            ...options,
            headers,
        },
    );

    if (!response.ok) {
        const body = await response
            .json()
            .catch(() => null);

        throw new ApiError(
            response.status,
            body?.detail ?? "Request failed",
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}