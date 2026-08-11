import { apiClient } from "@/lib/apiClient";
import type { BulkSettlementResponse } from "./types";

export async function requestBulkSettlement(employmentIds: number[]): Promise<BulkSettlementResponse> {
    const response = await apiClient.post<BulkSettlementResponse>("/api/settlements/request", employmentIds);
    return response.data;
}
