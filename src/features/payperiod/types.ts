export type PayPeriodStatus = "ACTIVE" | "SETTLING" | "CLOSED";

export interface PayPeriodSummaryResponse {
    employmentId: number;
    workerName: string;
    periodStart: string;
    totalEarnedAmount: number;
    totalEwaAmount: number;
    remainingEwaLimit: number;
    activeSessionStatus: "WORKING" | "PAUSED" | null;
    payPeriodStatus: PayPeriodStatus;
}
