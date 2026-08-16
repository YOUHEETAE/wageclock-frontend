import { useState } from "react";
import type { BulkSettlementResponse } from "./types";
import type { PayPeriodSummaryResponse } from "../payperiod/types";
import { requestBulkSettlement } from "./api";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

function SettlementPage() {
    const location = useLocation();
    const [result, setResult] = useState<BulkSettlementResponse | null>(null);
    const { selectedIds, summaryList }: { selectedIds: number[]; summaryList: PayPeriodSummaryResponse[] } = location.state;

    const selectedWorkers = summaryList.filter(w => selectedIds.includes(w.employmentId));
    const total = selectedWorkers.reduce((sum, w) => sum + w.totalEarnedAmount - w.totalEwaAmount, 0);

    const handleRequestSettlement = async () => {
        const response = await requestBulkSettlement(selectedIds);
        setResult(response);
    };

    const formatDateTime = (dateStr: string) =>
        new Date(dateStr).toLocaleString("ko-KR", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit",
        });

    if (result) {
        return (
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-8 text-center">
                    <span className="material-symbols-outlined text-[48px] text-[#004ecb] block mb-4">account_balance</span>
                    <h2 className="text-xl font-bold text-[#191c1d] mb-2">가상계좌 발급 완료</h2>
                    <p className="text-sm text-[#737687] mb-6">아래 계좌로 입금하시면 정산이 완료됩니다.</p>
                    <div className="bg-[#f8f9fa] rounded-2xl p-5 text-left mb-4 flex flex-col gap-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-[#737687]">은행</span>
                            <span className="text-sm font-semibold text-[#191c1d]">{result.bank}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-[#737687]">계좌번호</span>
                            <span className="text-sm font-semibold text-[#191c1d] font-mono">{result.accountNumber}</span>
                        </div>
                        <div className="flex justify-between border-t border-[#edeeef] pt-3">
                            <span className="text-sm text-[#737687]">입금 금액</span>
                            <span className="text-xl font-bold text-[#004ecb]">₩{result.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-[#737687]">입금 기한</span>
                            <span className="text-sm font-medium text-red-500">{formatDateTime(result.expiredAt)}</span>
                        </div>
                    </div>
                    <p className="text-xs text-[#737687]">입금 기한 내 입금하지 않으면 가상계좌가 만료됩니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-[#191c1d] mb-2">일괄 정산</h1>
            <p className="text-sm text-[#737687] mb-6">정산 내역을 확인 후 진행하세요.</p>

            <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] overflow-hidden mb-4">
                {selectedWorkers.map((worker, i) => (
                    <div
                        key={worker.employmentId}
                        className={`px-5 py-4 flex justify-between items-center ${i !== 0 ? "border-t border-[#edeeef]" : ""}`}
                    >
                        <p className="text-sm font-medium text-[#191c1d]">{worker.workerName}</p>
                        <p className="text-sm font-bold text-[#191c1d]">
                            ₩{(worker.totalEarnedAmount - worker.totalEwaAmount).toLocaleString()}
                        </p>
                    </div>
                ))}
                <div className="px-5 py-4 border-t border-[#edeeef] bg-[#f8f9fa] flex justify-between items-center">
                    <p className="text-sm font-semibold text-[#191c1d]">총 금액</p>
                    <p className="text-xl font-bold text-[#004ecb]">₩{total.toLocaleString()}</p>
                </div>
            </div>

            <Button onClick={handleRequestSettlement} className="w-full h-12 text-base font-semibold">
                <span className="material-symbols-outlined text-[18px] mr-1">payments</span>
                정산 확인 및 가상계좌 발급
            </Button>
        </div>
    );
}

export default SettlementPage;
