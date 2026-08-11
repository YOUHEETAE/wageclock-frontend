export type EventType =
    | "PAY_PERIOD_START"
    | "PAY_PERIOD_END"
    | "WORK_SESSION_START"
    | "WORK_SESSION_END"
    | "EWA_REQUEST";

export interface PayPeriodPayload {
    payPeriodId: number;
    payPeriodStart: string;
    payPeriodEnd: string | null;
    totalEarnedAmount: number;
    totalEwaAmount: number;
    status: "ACTIVE" | "CLOSED";
}

export interface WorkSessionPayload {
    workSessionId: number;
    clockIn: string;
    clockOut: string | null;
    earnedAmount: number;
}

export interface EwaPayload {
    ewaRequestId: number;
    requestedAmount: number;
    status: "PENDING" | "PROCESSING" | "APPROVED" | "REJECTED" | "FAILED";
    createdAt: string;
}

export interface HistoryEvent {
    eventType: EventType;
    timestamp: string;
    historyPayload: PayPeriodPayload | WorkSessionPayload | EwaPayload;
}

export interface HistoryResponse {
    employmentId: number;
    nextCursor: string | null;
    hasNext: boolean;
    events: HistoryEvent[];
}
