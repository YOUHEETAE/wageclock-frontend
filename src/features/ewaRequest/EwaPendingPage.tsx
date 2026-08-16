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

    const formatDateTime = (dateStr: string) =>
        new Date(dateStr).toLocaleString("ko-KR", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit",
        });

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-[#191c1d] mb-6">선지급 요청 검토</h1>

            <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-6 mb-6">
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#edeeef]">
                    <div className="w-10 h-10 rounded-full bg-[#d7e2ff] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px] text-[#004ecb]">person</span>
                    </div>
                    <div>
                        <p className="text-base font-semibold text-[#191c1d]">{ewa.workerName}</p>
                        <p className="text-xs text-[#737687]">근로자</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#737687]">신청 금액</span>
                        <span className="text-2xl font-bold text-[#004ecb]">₩{ewa.requestedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#737687]">신청 시각</span>
                        <span className="text-sm font-medium text-[#191c1d]">{formatDateTime(ewa.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    onClick={handleReject}
                    className="h-12 text-base font-semibold text-red-500 border-red-200 hover:bg-red-50"
                >
                    거절
                </Button>
                <Button onClick={handleInitiate} className="h-12 text-base font-semibold">
                    승인
                </Button>
            </div>
        </div>
    );
}

export default EwaPendingPage;
