import { apiClient } from "@/lib/apiClient";
import type { PayPeriodSummaryResponse } from "./types";

export async function getPayPeriodSummary(employmentId: number): Promise<PayPeriodSummaryResponse> {
    const response = await apiClient.get<PayPeriodSummaryResponse>(`/api/pay-periods/${employmentId}/summary`);
    return response.data;
}

export async function getPayPeriodSummaries(workplaceId: number): Promise<PayPeriodSummaryResponse[]> {
    const response = await apiClient.get<PayPeriodSummaryResponse[]>(`/api/pay-periods/summaries`, {
        params: { workplaceId }
    });
    return response.data;
}
