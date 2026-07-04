import { apiClient } from "@/lib/apiClient";
import type { EmploymentRequest, EmploymentResponse } from "./types";

export async function createEmployment(data: EmploymentRequest): Promise<EmploymentResponse> {
    const response = await apiClient.post<EmploymentResponse>("/api/employments", data);
    return response.data;
}
