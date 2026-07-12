import { apiClient } from "@/lib/apiClient";
import type { EwaRequestDto, EwaResponseDto, EwaRequestDetailResponse, InitiateEwaResponse, PendingEwaResponse } from "./types";

export async function requestEwa(data: EwaRequestDto): Promise<EwaResponseDto> {
    const response = await apiClient.post<EwaResponseDto>("/api/ewa-requests/request", data);
    return response.data;
}

export async function initiateEwa(ewaRequestId: number): Promise<InitiateEwaResponse> {
    const response = await apiClient.post<InitiateEwaResponse>(`/api/ewa-requests/${ewaRequestId}/initiate`);
    return response.data;
}

export async function rejectEwa(ewaRequestId: number): Promise<EwaResponseDto> {
    const response = await apiClient.post<EwaResponseDto>(`/api/ewa-requests/${ewaRequestId}/reject`);
    return response.data;
}

export async function getPendingEwaRequests(workplaceId: number): Promise<PendingEwaResponse[]> {
    const response = await apiClient.get<PendingEwaResponse[]>("/api/ewa-requests/pending", {
        params: { workplaceId }
    });
    return response.data;
}

export async function getMyEwaRequests(employmentId: number): Promise<EwaRequestDetailResponse[]> {
    const response = await apiClient.get<EwaRequestDetailResponse[]>("/api/ewa-requests/my-requests", {
        params: { employmentId }
    });
    return response.data;
}
