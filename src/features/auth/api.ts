import { apiClient } from "@/lib/apiClient";
import type { LoginRequest, LoginResponse, SignupRequest } from "./types";

export async function login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/api/auth/login", data);
    return response.data;
}

export async function signup(data: SignupRequest): Promise<void> {
    await apiClient.post("/api/auth/sign-up", data);
}