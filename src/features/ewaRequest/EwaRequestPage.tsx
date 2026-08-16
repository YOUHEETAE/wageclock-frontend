import { useState } from "react";
import { useLocation } from "react-router-dom";
import type { EwaResponseDto } from "./types";
import { requestEwa } from "./api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function EwaRequestPage() {
    const location = useLocation();
    const { employmentId, remainingEwaLimit } = location.state;
    const [requestAmount, setRequestAmount] = useState<number>(0);
    const [result, setResult] = useState<EwaResponseDto | null>(null);
    const [idempotencyKey] = useState(() => crypto.randomUUID());

    const handleRequest = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await requestEwa({ employmentId, requestAmount, idempotencyKey });
        setResult(response);
    };

    if (result) {
        return (
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-8 text-center">
                    <span className="material-symbols-outlined text-[48px] text-[#004ecb] block mb-4">check_circle</span>
                    <h2 className="text-xl font-bold text-[#191c1d] mb-2">신청 완료</h2>
                    <p className="text-sm text-[#737687] mb-6">고용주 승인 후 처리됩니다.</p>
                    <div className="bg-[#f8f9fa] rounded-xl p-4 text-left mb-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[#737687]">신청 금액</span>
                            <span className="text-lg font-bold text-[#004ecb]">₩{result.requestAmount.toLocaleString()}</span>
                        </div>
                    </div>
                    <p className="text-xs text-[#737687]">이번 기간 현황에서 처리 상태를 확인하세요.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-[#191c1d] mb-6">선지급 요청</h1>

            <div className="bg-[#d7e2ff] rounded-2xl p-5 mb-6">
                <p className="text-xs font-medium text-[#004ecb] mb-1">선지급 가능 금액</p>
                <p className="text-3xl font-bold text-[#004ecb]">₩{remainingEwaLimit?.toLocaleString() ?? 0}</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-6">
                <form onSubmit={handleRequest} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#191c1d]">신청 금액</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#737687]">₩</span>
                            <Input
                                type="number"
                                value={requestAmount || ""}
                                onChange={(e) => setRequestAmount(Number(e.target.value))}
                                className="pl-7"
                                placeholder="0"
                                max={remainingEwaLimit}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={!requestAmount || requestAmount <= 0}>
                        요청하기
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default EwaRequestPage;
