import { useNavigate, useParams } from "react-router-dom";
import { getPayPeriodSummary } from "./api";
import type { PayPeriodSummaryResponse } from "./types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function PayPeriodSummaryPage() {
    const [summary, setSummary] = useState<PayPeriodSummaryResponse | null>(null);
    const { employmentId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getPayPeriodSummary(Number(employmentId)).then(setSummary)
    }, [])

    return (
        <div>
            <p>기간 시작: {summary?.periodStart}</p>
            <p>총 번 돈: {summary?.totalEarnedAmount}</p>
            <p>선지급 받은 금액: {summary?.totalEwaAmount}</p>
            <p>선지급 가능 금액: {summary?.remainingEwaLimit}</p>
            <Button onClick={() => navigate("/ewa-request", {
                state: {
                    employmentId: Number(employmentId),
                    remainingEwaLimit: summary?.remainingEwaLimit
                }
            })}>선지급 요청</Button>
        </div>
    )
}
export default PayPeriodSummaryPage;