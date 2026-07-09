export interface PayPeriodSummaryResponse {
    employmentId: number;
    workerName: string;
    periodStart: string;
    totalEarnedAmount: number;
    totalEwaAmount: number;
    remainingEwaLimit: number;
    workSessionStatus: "WORKING" | "PAUSED" | null;
}
