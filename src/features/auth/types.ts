export type UserRole = "WORKER" | "EMPLOYER";

export interface LoginRequest {
    email: string,
    password: string,
}

export interface LoginResponse {
    name: string,
    email: string,
    role: UserRole,
    token: string
}

export interface SignupRequest {
    name: string,
    email: string,
    password: string,
    role: UserRole
}