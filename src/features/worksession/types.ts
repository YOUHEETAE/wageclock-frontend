export interface ClockInRequest {
    employmentId: number;
}

export interface ClockInResponse {
    sessionId: number;
    clockIn: string;
}

export interface ClockOutRequest {
    sessionId: number;
}

export interface ClockOutResponse {
    clockOut: string;
    earnedAmount: number;
}

export interface CurrentSessionResponse {
    sessionId: number;
    status: "WORKING" | "PAUSED";
}