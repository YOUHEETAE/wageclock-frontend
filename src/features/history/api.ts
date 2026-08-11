import { apiClient } from "@/lib/apiClient";
import type { HistoryResponse } from "./types";

export async function getHistories(
    employmentId: number,
    after?: string,
    size: number = 20
): Promise<HistoryResponse> {
    const response = await apiClient.get<HistoryResponse>(`/api/histories/${employmentId}`, {
        params: { after, size }
    });
    return response.data;
}
