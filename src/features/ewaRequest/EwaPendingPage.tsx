import { useLocation, useNavigate } from "react-router-dom";
import { initiateEwa, rejectEwa } from "./api";
import { Button } from "@/components/ui/button";

function EwaPendingPage() {
    const { ewa } = useLocation().state;
    const navigate = useNavigate();

    const handleInitiate = async () => {
        await initiateEwa(ewa.ewaRequestId);
        navigate(-1);
    };

    const handleReject = async () => {
        await rejectEwa(ewa.ewaRequestId);
        navigate(-1);
    };

    return (
        <div>
            <p>선지급 요청 대기</p>
            <p>{ewa.workerName}</p>
            <p>신청 금액: ₩{ewa.requestedAmount.toLocaleString()}</p>
            <p>신청 시각: {ewa.createdAt}</p>
            <Button onClick={handleInitiate}>승인</Button>
            <Button onClick={handleReject}>거절</Button>
        </div>
    )
}
export default EwaPendingPage;