import { apiClient } from "@/lib/apiClient";
import type { ClockInRequest, ClockInResponse, ClockOutRequest, ClockOutResponse, CurrentSessionResponse, PauseResponse, ResumeResponse } from "./types";

export async function clockIn(data: ClockInRequest): Promise<ClockInResponse> {
    const response = await apiClient.post<ClockInResponse>("/api/work-sessions/clock-in", data);
    return response.data;
}

export async function clockOut(data: ClockOutRequest): Promise<ClockOutResponse> {
    const response = await apiClient.post<ClockOutResponse>("/api/work-sessions/clock-out", data);
    return response.data;
}

export async function pause(data: ClockOutRequest): Promise<PauseResponse> {
    const response = await apiClient.post<PauseResponse>("/api/work-sessions/pause", data);
    return response.data;
}

export async function resume(data: ClockOutRequest): Promise<ResumeResponse> {
    const response = await apiClient.post<ResumeResponse>("/api/work-sessions/resume", data);
    return response.data;
}

export async function getCurrentSession(employmentId: number): Promise<CurrentSessionResponse | null> {
    const response = await apiClient.get<CurrentSessionResponse>("/api/work-sessions/current", {
        params: { employmentId }
    });
    return response.status === 204 ? null : response.data;
}