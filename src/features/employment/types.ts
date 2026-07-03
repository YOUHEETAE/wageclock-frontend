export interface EmploymentResponse {
    employmentId: number;
    hourlyWage: number;
    employmentName: string;
}

export interface EmploymentRequest {
    workerEmail: string;
    hourlyWage: number;
    employmentName: string;
}