export type EwaRequestStatus = "PENDING" | "PROCESSING" | "APPROVED" | "REJECTED";

export interface EwaRequestDto {
    employmentId: number;
    requestAmount: number;
    idempotencyKey: string;
}

export interface EwaResponseDto {
    ewaRequestId: number;
    requestAmount: number;
    status: EwaRequestStatus;
}

export interface InitiateEwaResponse {
    ewaRequestId: number;
    amount: number;
    status: EwaRequestStatus;
}

export interface PendingEwaResponse {
    ewaRequestId: number;
    employmentId: number;
    workerName: string;
    requestedAmount: number;
    createdAt: string;
}

export interface EwaRequestDetailResponse {
    ewaRequestId: number;
    requestAmount: number;
    status: EwaRequestStatus;
    createdAt: string;
    updatedAt: string;
}
