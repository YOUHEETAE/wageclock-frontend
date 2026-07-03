import { apiClient } from "@/lib/apiClient";
import type { ClockInRequest, ClockInResponse, ClockOutRequest, ClockOutResponse } from "./types";

export async function clockIn(data: ClockInRequest): Promise<ClockInResponse> {
    const response = await apiClient.post<ClockInResponse>("/api/work-sessions/clock-in", data);
    return response.data;
}

export async function clockOut(data: ClockOutRequest): Promise<ClockOutResponse> {
    const response = await apiClient.post<ClockOutResponse>("/api/work-sessions/clock-out", data);
    return response.data;
}

export async function pause(data: ClockOutRequest): Promise<void> {
    await apiClient.post<void>("/api/work-sessions/pause", data)
}

export async function resume(data: ClockOutRequest): Promise<void> {
    await apiClient.post<void>("/api/work-sessions/resume", data)
}