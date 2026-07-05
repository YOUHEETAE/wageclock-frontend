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

export interface PauseResponse {
    earnedAmount: number;
}

export interface ResumeResponse {
    lastResumeAt: string;
}

export interface CurrentSessionResponse {
    sessionId: number;
    status: "WORKING" | "PAUSED";
    hourlyWage: number;
    earnedAmount: number;
    lastResumeAt: string | null;
}