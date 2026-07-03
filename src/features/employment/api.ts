import { apiClient } from "@/lib/apiClient";
import type { EmploymentResponse, EmploymentRequest } from "./types";


export async function getWorkerEmployments() {
    const response = await apiClient.get<EmploymentResponse[]>("/api/employments/worker")
    return response.data;
}


export async function getEmployerEmployments() {
    const response = await apiClient.get<EmploymentResponse[]>("/api/employments/employer")
    return response.data;
}

export async function createEmployment(data: EmploymentRequest) {
    const response = await apiClient.post<EmploymentResponse>("/api/employments", data)
    return response.data
}