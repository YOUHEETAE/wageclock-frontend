import { useState } from "react";
import type { BulkSettlementResponse } from "./types";
import type { PayPeriodSummaryResponse } from "../payperiod/types";
import { requestBulkSettlement } from "./api";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

function SettlementPage() {
    const location = useLocation();
    const [result, setResult] = useState<BulkSettlementResponse | null>(null);
    const { selectedIds, summaryList }: { selectedIds: number[], summaryList: PayPeriodSummaryResponse[] } = location.state;
    const total = summaryList
        .filter(w => selectedIds.includes(w.employmentId))
        .reduce((sum, w) => sum + w.totalEarnedAmount - w.totalEwaAmount, 0);

    const handleRequestSettlement = async () => {
        const response = await requestBulkSettlement(selectedIds);
        setResult(response);
    }
    return (
        <div>
            {result === null ? (
                <div>
                    {summaryList.filter(w => selectedIds.includes(w.employmentId)).map(worker => (
                        <div key={worker.employmentId}>
                            <p>{worker.workerName}</p>
                            <p>₩{(worker.totalEarnedAmount - worker.totalEwaAmount).toLocaleString()}</p>
                        </div>
                    ))}
                    <p>총 금액: ₩{total.toLocaleString()}</p>
                    <Button onClick={handleRequestSettlement}>정산 확인</Button>
                </div>
            ) : (
                <div>
                    <p>은행: {result.bank}</p>
                    <p>계좌번호: {result.accountNumber}</p>
                    <p>입금 금액: ₩{result.totalAmount.toLocaleString()}</p>
                    <p>입금 기한: {result.expiredAt}</p>
                    <p>입금이 확인되면 정산이 완료됩니다.</p>
                </div>
            )}
        </div>

    )
}
export default SettlementPage;