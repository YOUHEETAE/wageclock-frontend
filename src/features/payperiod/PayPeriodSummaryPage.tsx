import { useNavigate, useParams } from "react-router-dom";
import { getPayPeriodSummary } from "./api";
import type { PayPeriodSummaryResponse } from "./types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { EwaRequestDetailResponse } from "../ewaRequest/types";
import { getMyEwaRequests } from "../ewaRequest/api";

const ewaStatusLabel: Record<string, { text: string; color: string; bg: string }> = {
    PENDING:    { text: "대기 중",    color: "#b45309", bg: "#fef3c7" },
    PROCESSING: { text: "처리 중",    color: "#004ecb", bg: "#d7e2ff" },
    APPROVED:   { text: "승인됨",     color: "#15803d", bg: "#dcfce7" },
    REJECTED:   { text: "거절됨",     color: "#b91c1c", bg: "#fee2e2" },
    FAILED:     { text: "실패",       color: "#737687", bg: "#edeeef" },
};

function PayPeriodSummaryPage() {
    const [summary, setSummary] = useState<PayPeriodSummaryResponse | null>(null);
    const { employmentId } = useParams();
    const navigate = useNavigate();
    const [ewaRequests, setEwaRequests] = useState<EwaRequestDetailResponse[]>([]);

    useEffect(() => {
        getPayPeriodSummary(Number(employmentId)).then(setSummary);
        getMyEwaRequests(Number(employmentId)).then(setEwaRequests);

        const poll = setInterval(() => {
            getMyEwaRequests(Number(employmentId)).then(setEwaRequests);
        }, 5000);

        return () => clearInterval(poll);
    }, []);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-[#191c1d] mb-6">이번 기간 현황</h1>

            <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-6 mb-4">
                <p className="text-xs font-medium text-[#737687] uppercase tracking-wide mb-4">
                    {summary ? `${formatDate(summary.periodStart)} 부터` : "로딩 중..."}
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-[#737687] mb-1">총 번 돈</p>
                        <p className="text-2xl font-bold text-[#191c1d]">₩{summary?.totalEarnedAmount.toLocaleString() ?? "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#737687] mb-1">선지급 받은 금액</p>
                        <p className="text-2xl font-bold text-[#191c1d]">₩{summary?.totalEwaAmount.toLocaleString() ?? "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#737687] mb-1">선지급 가능 금액</p>
                        <p className="text-2xl font-bold text-[#004ecb]">₩{summary?.remainingEwaLimit.toLocaleString() ?? "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#737687] mb-1">현재 상태</p>
                        <p className="text-base font-semibold text-[#191c1d]">
                            {summary?.activeSessionStatus === "WORKING" ? "근무 중" :
                             summary?.activeSessionStatus === "PAUSED" ? "일시정지" : "대기 중"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mb-6">
                <Button
                    onClick={() => navigate("/ewa-request", {
                        state: { employmentId: Number(employmentId), remainingEwaLimit: summary?.remainingEwaLimit }
                    })}
                    className="flex-1"
                >
                    선지급 요청
                </Button>
                <Button
                    variant="outline"
                    onClick={() => navigate(`/history/${employmentId}`)}
                    className="flex-1"
                >
                    이력 보기
                </Button>
            </div>

            <div>
                <h2 className="text-base font-semibold text-[#191c1d] mb-3">내 선지급 현황</h2>
                {ewaRequests.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#edeeef] p-6 text-center">
                        <p className="text-sm text-[#737687]">선지급 요청 내역이 없습니다.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {ewaRequests.map((ewa) => {
                            const s = ewaStatusLabel[ewa.status] ?? ewaStatusLabel.FAILED;
                            return (
                                <div key={ewa.ewaRequestId} className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-base font-bold text-[#191c1d]">₩{ewa.requestAmount.toLocaleString()}</p>
                                        <p className="text-xs text-[#737687] mt-0.5">
                                            {new Date(ewa.createdAt).toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                    <span
                                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                                        style={{ color: s.color, backgroundColor: s.bg }}
                                    >
                                        {s.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PayPeriodSummaryPage;
