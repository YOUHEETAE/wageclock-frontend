import { useNavigate, useParams } from "react-router-dom";
import { getPayPeriodSummary } from "./api";
import type { PayPeriodSummaryResponse } from "./types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { EwaRequestDetailResponse } from "../ewaRequest/types";
import { getMyEwaRequests } from "../ewaRequest/api";

function PayPeriodSummaryPage() {
    const [summary, setSummary] = useState<PayPeriodSummaryResponse | null>(null);
    const { employmentId } = useParams();
    const navigate = useNavigate();
    const [ewaRequests, setEwaRequests] = useState<EwaRequestDetailResponse[] | null>(null);

    useEffect(() => {
        getPayPeriodSummary(Number(employmentId)).then(setSummary);
        getMyEwaRequests(Number(employmentId)).then(setEwaRequests);

        const poll = setInterval(() => {
            getMyEwaRequests(Number(employmentId)).then(setEwaRequests);
        }, 5000);

        return () => clearInterval(poll);
    }, [])


    return (
        <div>
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
                <Button onClick={() => navigate(`/history/${employmentId}`)}>이력 보기</Button>
            </div>
            <div>
                <p>내 선지급 현황</p>
                {ewaRequests?.map((ewa) => (
                    <div key={ewa.ewaRequestId}>
                        <p>신청 금액: ₩{ewa.requestAmount.toLocaleString()}</p>
                        <p>상태: {ewa.status}</p>
                        <p>신청 시각: {ewa.createdAt}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default PayPeriodSummaryPage;