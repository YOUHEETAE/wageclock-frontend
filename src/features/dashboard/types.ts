export type WorkSessionStatus = "WORKING" | "PAUSED" | "COMPLETED";

export interface DashboardResponse {
    employmentId: number;
    workerId: number;
    workerName: string;
    todayEwaAmount: number;
    status: WorkSessionStatus | null;
    hourlyWage: number;
    earnedAmount: number;
    lastResumeAt: string | null;
}
