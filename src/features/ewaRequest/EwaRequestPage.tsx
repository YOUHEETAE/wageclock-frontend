import { useState } from "react";
import { useLocation } from "react-router-dom";
import type { EwaResponseDto } from "./types";
import { requestEwa } from "./api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function EwaRequestPage() {
    const location = useLocation();
    const { employmentId, remainingEwaLimit } = location.state;
    const [requestAmount, setRequestAmout] = useState<number>(0);
    const [result, setResult] = useState<EwaResponseDto | null>(null);
    const [idempotencyKey] = useState(() => crypto.randomUUID());

    const handleRequest = async () => {
        const response = await requestEwa({
            employmentId,
            requestAmount,
            idempotencyKey
        });
        setResult(response);
    }

    return (
        <div>
            <form onSubmit={handleRequest}>
                <p>선지급 가능 금액: ₩{remainingEwaLimit.toLocaleString()}</p>
                <Input
                    type="number"
                    value={requestAmount}
                    onChange={(e) => setRequestAmout(Number(e.target.value))}
                />
                <Button type="submit">요청</Button>
            </form>
            {result && (
                <div>
                    <p>신청 완료!</p>
                    <p>신청 금액: ₩{result.requestAmount.toLocaleString()}</p>
                    <p>상태: 고용주 승인 대기 중</p>
                </div>
            )}
        </div>
    )
}
export default EwaRequestPage;