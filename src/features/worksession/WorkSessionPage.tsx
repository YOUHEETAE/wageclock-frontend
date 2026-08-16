import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clockIn, clockOut, pause, resume, getCurrentSession } from "./api";
import type { WorkplaceResponse } from "../workplace/types";
import { Button } from "@/components/ui/button";
import type { CurrentSessionResponse } from "./types";
import { getPayPeriodSummary } from "../payperiod/api";
import type { PayPeriodSummaryResponse } from "../payperiod/types";

function calcCurrentEarned(session: CurrentSessionResponse): number {
    if (session.status !== "WORKING" || !session.lastResumeAt) {
        return session.earnedAmount;
    }
    const secondsElapsed = (Date.now() - new Date(session.lastResumeAt).getTime()) / 1000;
    return session.earnedAmount + (session.hourlyWage * secondsElapsed) / 3600;
}

function formatTimer(session: CurrentSessionResponse | null): string {
    if (session === null) return "00:00:00";
    const earned = calcCurrentEarned(session);
    const totalSeconds = Math.floor((earned / session.hourlyWage) * 3600);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const RADIUS = 108;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ringColor(pct: number): string {
    if (pct >= 90) return "#ef4444";
    if (pct >= 70) return "#f59e0b";
    return "#004ecb";
}

interface ClockRingProps {
    session: CurrentSessionResponse | null;
    summary: PayPeriodSummaryResponse | null;
}

function ClockRing({ session, summary }: ClockRingProps) {
    const earned = session ? calcCurrentEarned(session) : 0;

    const ewaPercent = summary && summary.totalEarnedAmount > 0
        ? Math.min(100, (summary.totalEwaAmount / (summary.totalEarnedAmount * 0.3)) * 100)
        : 0;

    const offset = CIRCUMFERENCE * (1 - ewaPercent / 100);
    const color = ringColor(ewaPercent);
    const isPaused = session?.status === "PAUSED";

    return (
        <div className="relative w-[260px] h-[260px] mx-auto">
            <svg width="260" height="260" viewBox="0 0 260 260" className="absolute inset-0">
                {/* 배경 링 */}
                <circle
                    cx="130" cy="130" r={RADIUS}
                    fill="none"
                    stroke="#edeeef"
                    strokeWidth="14"
                />
                {/* 진행 링 */}
                <circle
                    cx="130" cy="130" r={RADIUS}
                    fill="none"
                    stroke={color}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={offset}
                    transform="rotate(-90 130 130)"
                    style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
                />
            </svg>

            {/* 중앙 콘텐츠 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                {isPaused && (
                    <span className="text-[10px] font-semibold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-full mb-1">
                        일시정지
                    </span>
                )}
                <span className="text-[32px] font-bold text-[#191c1d] tracking-tight font-mono leading-none">
                    {formatTimer(session)}
                </span>
                {session ? (
                    <>
                        <span className="text-[22px] font-bold leading-none" style={{ color }}>
                            ₩{Math.floor(earned).toLocaleString()}
                        </span>
                        <span className="text-[11px] text-[#737687] mt-1">
                            EWA 소진율 {Math.round(ewaPercent)}%
                        </span>
                    </>
                ) : (
                    <span className="text-xs text-[#737687]">출근 전</span>
                )}
            </div>
        </div>
    );
}

const statusLabel: Record<string, { text: string; color: string; bg: string }> = {
    WORKING: { text: "근무 중", color: "#004ecb", bg: "#d7e2ff" },
    PAUSED:  { text: "일시정지", color: "#b45309", bg: "#fef3c7" },
};

function WorkSessionPage() {
    const [session, setSession] = useState<CurrentSessionResponse | null>(null);
    const [summary, setSummary] = useState<PayPeriodSummaryResponse | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [_tick, setTick] = useState(0);
    const workplace: WorkplaceResponse = location.state.workplace;

    useEffect(() => {
        getCurrentSession(workplace.employmentId!).then((s) => {
            if (s) setSession(s);
        });
        getPayPeriodSummary(workplace.employmentId!).then(setSummary);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleClockIn = async () => {
        const response = await clockIn({ employmentId: workplace.employmentId! });
        setSession({
            sessionId: response.sessionId,
            status: "WORKING",
            hourlyWage: response.hourlyWage,
            earnedAmount: 0,
            lastResumeAt: response.clockIn,
        });
    };

    const handleClockOut = async () => {
        await clockOut({ sessionId: session!.sessionId });
        setSession(null);
        getPayPeriodSummary(workplace.employmentId!).then(setSummary);
    };

    const handlePause = async () => {
        const response = await pause({ sessionId: session!.sessionId });
        setSession(prev => ({ ...prev!, status: "PAUSED", earnedAmount: response.earnedAmount }));
    };

    const handleResume = async () => {
        const response = await resume({ sessionId: session!.sessionId });
        setSession(prev => ({ ...prev!, status: "WORKING", lastResumeAt: response.lastResumeAt }));
    };

    const status = session?.status ? statusLabel[session.status] : null;

    return (
        <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#191c1d]">{workplace.name}</h1>
                    <p className="text-sm text-[#737687] mt-0.5">{workplace.address}</p>
                </div>
                {status && (
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ color: status.color, backgroundColor: status.bg }}
                    >
                        {status.text}
                    </span>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] py-10 px-6 mb-4">
                <ClockRing session={session} summary={summary} />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-4">
                    <p className="text-xs text-[#737687] mb-1">시급</p>
                    <p className="text-lg font-bold text-[#191c1d]">₩{(session?.hourlyWage ?? 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-4">
                    <p className="text-xs text-[#737687] mb-1">이번 기간 선지급</p>
                    <p className="text-lg font-bold text-[#191c1d]">₩{(summary?.totalEwaAmount ?? 0).toLocaleString()}</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {session === null && (
                    <Button onClick={handleClockIn} className="w-full h-12 text-base font-semibold">
                        <span className="material-symbols-outlined mr-2">login</span>
                        출근
                    </Button>
                )}
                {session?.status === "WORKING" && (
                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={handlePause} variant="outline" className="h-12 text-base font-semibold">
                            <span className="material-symbols-outlined mr-2">pause</span>
                            일시정지
                        </Button>
                        <Button onClick={handleClockOut} variant="outline" className="h-12 text-base font-semibold text-red-500 border-red-200 hover:bg-red-50">
                            <span className="material-symbols-outlined mr-2">logout</span>
                            퇴근
                        </Button>
                    </div>
                )}
                {session?.status === "PAUSED" && (
                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={handleResume} className="h-12 text-base font-semibold">
                            <span className="material-symbols-outlined mr-2">play_arrow</span>
                            재개
                        </Button>
                        <Button onClick={handleClockOut} variant="outline" className="h-12 text-base font-semibold text-red-500 border-red-200 hover:bg-red-50">
                            <span className="material-symbols-outlined mr-2">logout</span>
                            퇴근
                        </Button>
                    </div>
                )}
                <Button
                    variant="ghost"
                    onClick={() => navigate(`/pay-period/${workplace.employmentId}`)}
                    className="w-full text-[#737687]"
                >
                    이번 기간 현황 보기
                    <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span>
                </Button>
            </div>
        </div>
    );
}

export default WorkSessionPage;
