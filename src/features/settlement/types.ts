export interface BulkSettlementResponse {
    bulkSettlementId: number;
    totalAmount: number;
    bank: string;
    accountNumber: string;
    expiredAt: string;
}
