export interface EmploymentRequest {
    workerEmail: string;
    hourlyWage: number;
    workplaceId: number;
}

export interface EmploymentResponse {
    employmentId: number;
    hourlyWage: number;
    workplaceId: number;
    workplaceName: string;
    workplaceAddress: string;
}
