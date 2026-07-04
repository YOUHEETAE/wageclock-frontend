export interface WorkplaceResponse {
    workplaceId: number;
    name: string;
    address: string;
    employmentId?: number; // 워커용 응답에만 포함
}

export interface WorkplaceRequest {
    name: string;
    address: string;
}

export interface WorkplaceWorkerResponse {
    employmentId: number;
    workerId: number;
    workerName: string;
    hourlyWage: number;
}
