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
    const workplace = JSON.parse(localStorage.getItem("workplace") || "{}");
    const workplaceName: string = workplace?.name ?? "";

    useEffect(() => {
        getPayPeriodSummaries(Number(workplaceId)).then(setSummaryList);
    }, []);

    const handleSelect = (employmentId: number) => {
        setSelectedIds(prev =>
            prev.includes(employmentId)
                ? prev.filter(id => id !== employmentId)
                : [...prev, employmentId]
        );
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });

    const selectedWorkers = summaryList.filter(w => selectedIds.includes(w.employmentId));
    const totalAmount = selectedWorkers.reduce((sum, w) => sum + w.totalEarnedAmount - w.totalEwaAmount, 0);

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-[#191c1d] mb-0.5">근로자 현황</h1>
            {workplaceName && <p className="text-sm text-[#737687] mb-1">{workplaceName}</p>}
            <p className="text-sm text-[#737687] mb-6">정산할 근로자를 선택하세요.</p>

            <div className="flex flex-col gap-3 mb-6">
                {summaryList.map((worker) => {
                    const isSelected = selectedIds.includes(worker.employmentId);
                    const canSelect = worker.payPeriodStatus === "ACTIVE" && worker.activeSessionStatus === null;
                    const netAmount = worker.totalEarnedAmount - worker.totalEwaAmount;
                    return (
                        <div
                            key={worker.employmentId}
                            className={`bg-white rounded-2xl border shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-5 transition-all
                                ${isSelected ? "border-[#004ecb]" : "border-[#edeeef]"}`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-base font-semibold text-[#191c1d]">{worker.workerName}</p>
                                    <p className="text-xs text-[#737687] mt-0.5">{formatDate(worker.periodStart)} 부터</p>
                                </div>
                                {canSelect ? (
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleSelect(worker.employmentId)}
                                        className="w-5 h-5 accent-[#004ecb] mt-0.5 cursor-pointer"
                                    />
                                ) : worker.payPeriodStatus === "SETTLING" ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-[#7c3aed] bg-[#ede9fe]">
                                        정산 중
                                    </span>
                                ) : worker.payPeriodStatus === "CLOSED" ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-[#737687] bg-[#edeeef]">
                                        정산 완료
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-[#004ecb] bg-[#d7e2ff]">
                                        근무 중
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <div className="bg-[#f8f9fa] rounded-xl p-3">
                                    <p className="text-[10px] text-[#737687] mb-1">총 번 돈</p>
                                    <p className="text-sm font-bold text-[#191c1d]">₩{worker.totalEarnedAmount.toLocaleString()}</p>
                                </div>
                                <div className="bg-[#f8f9fa] rounded-xl p-3">
                                    <p className="text-[10px] text-[#737687] mb-1">선지급액</p>
                                    <p className="text-sm font-bold text-[#191c1d]">₩{worker.totalEwaAmount.toLocaleString()}</p>
                                </div>
                                <div className="bg-[#f8f9fa] rounded-xl p-3">
                                    <p className="text-[10px] text-[#737687] mb-1">정산 금액</p>
                                    <p className="text-sm font-bold text-[#004ecb]">₩{netAmount.toLocaleString()}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/history/${worker.employmentId}`)}
                                className="text-xs text-[#737687] hover:text-[#004ecb] transition-colors flex items-center gap-0.5"
                            >
                                이력 보기
                                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
                    <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_8px_32px_rgba(0,78,203,0.15)] p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[#737687]">{selectedIds.length}명 선택</p>
                            <p className="text-lg font-bold text-[#004ecb]">₩{totalAmount.toLocaleString()}</p>
                        </div>
                        <Button onClick={() => navigate("/settlement", { state: { selectedIds, summaryList } })}>
                            일괄 정산
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PayPeriodListPage;
