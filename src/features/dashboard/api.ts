import { apiClient } from "@/lib/apiClient";
import type { DashboardResponse } from "./types";

export async function getDashboard(workplaceId: number): Promise<DashboardResponse[]> {
    const response = await apiClient.get<DashboardResponse[]>(`/api/dashboards/${workplaceId}`);
    return response.data;
}
