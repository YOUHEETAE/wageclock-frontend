import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DashboardResponse } from "./types";
import { Button } from "@/components/ui/button";
import { getDashboard } from "./api";
import type { PendingEwaResponse } from "../ewaRequest/types";
import { getPendingEwaRequests } from "../ewaRequest/api";
import { getPayPeriodSummaries } from "../payperiod/api";
import type { PayPeriodSummaryResponse } from "../payperiod/types";

const POLL_INTERVAL = 5000;
const RING_R = 56;
const RING_C = 2 * Math.PI * RING_R;

function calcCurrentEarned(worker: DashboardResponse): number {
    if (worker.status !== "WORKING" || !worker.lastResumeAt || worker.earnedAmount == null || !worker.hourlyWage) {
        return worker.earnedAmount ?? 0;
    }
    const secondsElapsed = (Date.now() - new Date(worker.lastResumeAt).getTime()) / 1000;
    return worker.earnedAmount + (worker.hourlyWage * secondsElapsed) / 3600;
}

function formatTimer(worker: DashboardResponse): string {
    if (!worker.status || worker.status === "COMPLETED") return "00:00:00";
    const earned = calcCurrentEarned(worker);
    const totalSeconds = Math.floor(((worker.hourlyWage ?? 0) > 0 ? earned / worker.hourlyWage : 0) * 3600);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ewaPercent(summary: PayPeriodSummaryResponse | null): number {
    if (!summary || summary.totalEarnedAmount <= 0) return 0;
    return Math.min(100, (summary.totalEwaAmount / (summary.totalEarnedAmount * 0.3)) * 100);
}

function ringColor(pct: number): string {
    if (pct >= 90) return "#ef4444";
    if (pct >= 70) return "#f59e0b";
    return "#004ecb";
}

const statusConfig: Record<string, { text: string; color: string; bg: string }> = {
    WORKING:   { text: "근무 중",  color: "#004ecb", bg: "#d7e2ff" },
    PAUSED:    { text: "일시정지", color: "#b45309", bg: "#fef3c7" },
    COMPLETED: { text: "퇴근",    color: "#737687", bg: "#edeeef" },
};

interface WorkerRingProps {
    worker: DashboardResponse;
    summary: PayPeriodSummaryResponse | null;
}

function WorkerRing({ worker, summary }: WorkerRingProps) {
    const pct = ewaPercent(summary);
    const offset = RING_C * (1 - pct / 100);
    const color = ringColor(pct);
    const earned = calcCurrentEarned(worker);

    return (
        <div className="relative w-[136px] h-[136px] flex-shrink-0">
            <svg width="136" height="136" viewBox="0 0 136 136" className="absolute inset-0">
                <circle cx="68" cy="68" r={RING_R} fill="none" stroke="#edeeef" strokeWidth="10" />
                {pct > 0 && (
                    <circle
                        cx="68" cy="68" r={RING_R}
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={RING_C}
                        strokeDashoffset={offset}
                        transform="rotate(-90 68 68)"
                        style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
                    />
                )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                <span className="text-[13px] font-bold text-[#191c1d] font-mono leading-none">
                    {formatTimer(worker)}
                </span>
                <span className="text-[12px] font-bold leading-none" style={{ color: pct > 0 ? color : "#737687" }}>
                    ₩{Math.floor(earned).toLocaleString()}
                </span>
                <span className="text-[10px] text-[#737687] leading-none mt-0.5">
                    {Math.round(pct)}%
                </span>
            </div>
        </div>
    );
}

function DashboardPage() {
    const { workplaceId } = useParams();
    const [workers, setWorkers] = useState<DashboardResponse[]>([]);
    const [_tick, setTick] = useState(0);
    const [pendingEwaList, setPendingEwaList] = useState<PendingEwaResponse[]>([]);
    const [periodSummaries, setPeriodSummaries] = useState<PayPeriodSummaryResponse[]>([]);
    const navigate = useNavigate();
    const workplace = JSON.parse(localStorage.getItem("workplace") || "{}");
    const workplaceName: string = workplace?.name ?? "";

    useEffect(() => {
        const fetchAll = async () => {
            const [dashboardData, ewaData, summaryData] = await Promise.all([
                getDashboard(Number(workplaceId)),
                getPendingEwaRequests(Number(workplaceId)),
                getPayPeriodSummaries(Number(workplaceId)),
            ]);
            setWorkers(dashboardData);
            setPendingEwaList(ewaData);
            setPeriodSummaries(summaryData);
        };
        fetchAll();

        const poll = setInterval(fetchAll, POLL_INTERVAL);
        const timer = setInterval(() => setTick((t) => t + 1), 1000);

        return () => {
            clearInterval(poll);
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#191c1d]">대시보드</h1>
                    {workplaceName && <p className="text-sm text-[#737687] mt-0.5">{workplaceName}</p>}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(`/workplaces/${workplaceId}/pay-periods`)}>
                        <span className="material-symbols-outlined text-[18px] mr-1">payments</span>
                        정산 관리
                    </Button>
                    <Button onClick={() => navigate(`/workplaces/${workplaceId}/employments/new`)}>
                        <span className="material-symbols-outlined text-[18px] mr-1">person_add</span>
                        근로자 추가
                    </Button>
                </div>
            </div>

            {workers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#edeeef] p-12 text-center">
                    <span className="material-symbols-outlined text-[48px] text-[#edeeef] block mb-3">group</span>
                    <p className="text-sm text-[#737687]">등록된 근로자가 없습니다.</p>
                    <Button onClick={() => navigate(`/workplaces/${workplaceId}/employments/new`)} className="mt-4">
                        근로자 추가하기
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {workers.map((worker) => {
                        const pendingEwa = pendingEwaList.find(e => e.employmentId === worker.employmentId);
                        const summary = periodSummaries.find(s => s.employmentId === worker.employmentId) ?? null;
                        const s = worker.status ? statusConfig[worker.status] : null;
                        return (
                            <div key={worker.employmentId} className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-5 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-base font-semibold text-[#191c1d]">{worker.workerName}</p>
                                    {s ? (
                                        <span
                                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                                            style={{ color: s.color, backgroundColor: s.bg }}
                                        >
                                            {s.text}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-[#737687] bg-[#edeeef]">
                                            대기 중
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-center mb-4">
                                    <WorkerRing worker={worker} summary={summary} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="bg-[#f8f9fa] rounded-xl p-2.5">
                                        <p className="text-[10px] text-[#737687] mb-0.5">시급</p>
                                        <p className="text-sm font-bold text-[#191c1d]">₩{(worker.hourlyWage ?? 0).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-[#f8f9fa] rounded-xl p-2.5">
                                        <p className="text-[10px] text-[#737687] mb-0.5">오늘 선지급</p>
                                        <p className="text-sm font-bold text-[#191c1d]">₩{(worker.todayEwaAmount ?? 0).toLocaleString()}</p>
                                    </div>
                                </div>

                                {pendingEwa && (
                                    <div className="mt-4 pt-4 border-t border-[#edeeef]">
                                        <Button
                                            onClick={() => navigate("/ewa-pending", { state: { ewa: pendingEwa } })}
                                            className="w-full bg-amber-500 hover:bg-amber-600 text-xs"
                                        >
                                            <span className="material-symbols-outlined text-[16px] mr-1">notifications</span>
                                            선지급 대기 중
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default DashboardPage;
