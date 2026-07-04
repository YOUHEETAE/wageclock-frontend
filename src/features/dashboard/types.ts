export type WorkSessionStatus = "WORKING" | "PAUSED" | "COMPLETED";

export interface DashboardResponse {
    employmentId: number;
    workerId: number;
    workerName: string;
    todayEarnedAmount: number;
    todayEwaAmount: number;
    status: WorkSessionStatus;
}
