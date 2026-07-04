import { apiClient } from "@/lib/apiClient";
import type { WorkplaceRequest, WorkplaceResponse, WorkplaceWorkerResponse } from "./types";

export async function getWorkerWorkplaces(): Promise<WorkplaceResponse[]> {
    const response = await apiClient.get<WorkplaceResponse[]>("/api/workplaces/worker");
    return response.data;
}

export async function getEmployerWorkplaces(): Promise<WorkplaceResponse[]> {
    const response = await apiClient.get<WorkplaceResponse[]>("/api/workplaces");
    return response.data;
}

export async function createWorkplace(data: WorkplaceRequest): Promise<WorkplaceResponse> {
    const response = await apiClient.post<WorkplaceResponse>("/api/workplaces", data);
    return response.data;
}

export async function getWorkplaceWorkers(workplaceId: number): Promise<WorkplaceWorkerResponse[]> {
    const response = await apiClient.get<WorkplaceWorkerResponse[]>(`/api/workplaces/${workplaceId}/workers`);
    return response.data;
}
