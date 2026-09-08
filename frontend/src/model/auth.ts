import { apiRequest } from "./api/client";


export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest{
    username: string;
    email: string;
    password: string;
}

export interface UserResponse{
    id: number;
    username: string;
    email: string;
    is_active: boolean;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}


export function loginUser(
    credentials: LoginRequest,
): Promise<TokenResponse> {
    return apiRequest<TokenResponse>(
        "/auth/login",
        {
            method: "POST",
            body: JSON.stringify(credentials),
        },
    );
}

export function registerUser(credentials: RegisterRequest) : Promise<UserResponse> {
    return apiRequest<UserResponse>(
        "/auth/register",
        {
            method: "POST",
            body: JSON.stringify(credentials),
        },
    );
}