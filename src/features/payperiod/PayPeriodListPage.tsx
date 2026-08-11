import { useEffect, useState } from "react";
import type { PayPeriodSummaryResponse } from "./types";
import { getPayPeriodSummaries } from "./api";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

function PayPeriodListPage() {
    const [summaryList, setSummaryList] = useState<PayPeriodSummaryResponse[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { workplaceId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getPayPeriodSummaries(Number(workplaceId)).then(setSummaryList);
    }, [])

    const handleSelect = (employmentId: number) => {
        setSelectedIds(prev =>
            prev?.includes(employmentId)
                ? prev.filter(id => id !== employmentId)
                : [...prev!, employmentId]
        );
    }

    return (
        <div>
            <div>
                {summaryList.map((worker) => (
                    <div key={(worker.employmentId)}>
                        <p>이름: {worker.workerName}</p>
                        <p>기간 시작: {worker.periodStart}</p>
                        <p>총 번 돈: ₩{worker.totalEarnedAmount.toLocaleString()}</p>
                        <p>선지급액: ₩{worker.totalEwaAmount.toLocaleString()}</p>
                        <p>선지급 가능: ₩{worker.remainingEwaLimit.toLocaleString()}</p>
                        {worker.activeSessionStatus === null && (
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(worker.employmentId)}
                                onChange={() => handleSelect(worker.employmentId)}
                            />
                        )}
                    </div>
                ))}
            </div>
            {selectedIds.length > 0 && (
                <Button onClick={() => navigate("/settlement", { state: { selectedIds, summaryList } })}>일괄 정산</Button>
            )}

        </div>
    )
}
export default PayPeriodListPage;