import { useState, useEffect } from "react";
import type { HistoryEvent, WorkSessionPayload, EwaPayload, PayPeriodPayload } from "./types";
import { getHistories } from "./api";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const eventConfig: Record<string, { label: string; icon: string; color: string; bg: string }> = {
    PAY_PERIOD_START:   { label: "페이 피리어드 시작", icon: "calendar_today",  color: "#15803d", bg: "#dcfce7" },
    PAY_PERIOD_END:     { label: "페이 피리어드 종료", icon: "event_available", color: "#737687", bg: "#edeeef" },
    WORK_SESSION_START: { label: "출근",               icon: "login",           color: "#004ecb", bg: "#d7e2ff" },
    WORK_SESSION_END:   { label: "퇴근",               icon: "logout",          color: "#b45309", bg: "#fef3c7" },
    EWA_REQUEST:        { label: "선지급 요청",          icon: "payments",        color: "#7c3aed", bg: "#ede9fe" },
};

const ewaStatusLabel: Record<string, string> = {
    PENDING: "대기 중", PROCESSING: "처리 중", APPROVED: "승인됨", REJECTED: "거절됨", FAILED: "실패",
};

function HistoryPage() {
    const [events, setEvents] = useState<HistoryEvent[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasNext, setHasNext] = useState(false);
    const { employmentId } = useParams();

    useEffect(() => {
        getHistories(Number(employmentId)).then((res) => {
            setEvents(res.events);
            setNextCursor(res.nextCursor);
            setHasNext(res.hasNext);
        });
    }, []);

    const handleLoadMore = async () => {
        const res = await getHistories(Number(employmentId), nextCursor ?? undefined);
        setEvents(prev => [...prev, ...res.events]);
        setNextCursor(res.nextCursor);
        setHasNext(res.hasNext);
    };

    const formatDateTime = (dateStr: string) =>
        new Date(dateStr).toLocaleString("ko-KR", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit",
        });

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("ko-KR", {
            year: "numeric", month: "2-digit", day: "2-digit",
        });

    const renderPayload = (event: HistoryEvent) => {
        switch (event.eventType) {
            case "WORK_SESSION_START": {
                const p = event.historyPayload as WorkSessionPayload;
                return <p className="text-sm text-[#737687]">출근 시각: {formatDateTime(p.clockIn)}</p>;
            }
            case "WORK_SESSION_END": {
                const p = event.historyPayload as WorkSessionPayload;
                return (
                    <div className="flex flex-col gap-0.5">
                        <p className="text-sm text-[#737687]">퇴근 시각: {p.clockOut ? formatDateTime(p.clockOut) : "-"}</p>
                        <p className="text-sm font-semibold text-[#004ecb]">₩{p.earnedAmount.toLocaleString()}</p>
                    </div>
                );
            }
            case "EWA_REQUEST": {
                const p = event.historyPayload as EwaPayload;
                return (
                    <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-semibold text-[#191c1d]">₩{p.requestedAmount.toLocaleString()}</p>
                        <p className="text-sm text-[#737687]">상태: {ewaStatusLabel[p.status] ?? p.status}</p>
                    </div>
                );
            }
            case "PAY_PERIOD_START": {
                const p = event.historyPayload as PayPeriodPayload;
                return <p className="text-sm text-[#737687]">시작일: {formatDate(p.payPeriodStart)}</p>;
            }
            case "PAY_PERIOD_END": {
                const p = event.historyPayload as PayPeriodPayload;
                return (
                    <div className="flex flex-col gap-0.5">
                        <p className="text-sm text-[#737687]">종료일: {p.payPeriodEnd ? formatDate(p.payPeriodEnd) : "-"}</p>
                        <p className="text-sm text-[#737687]">총 번 돈: <span className="font-semibold text-[#191c1d]">₩{p.totalEarnedAmount.toLocaleString()}</span></p>
                        <p className="text-sm text-[#737687]">선지급액: <span className="font-semibold text-[#191c1d]">₩{p.totalEwaAmount.toLocaleString()}</span></p>
                    </div>
                );
            }
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-[#191c1d] mb-6">이력</h1>

            {events.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#edeeef] p-12 text-center">
                    <span className="material-symbols-outlined text-[48px] text-[#edeeef] block mb-3">history</span>
                    <p className="text-sm text-[#737687]">이력이 없습니다.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {events.map((event, index) => {
                        const config = eventConfig[event.eventType];
                        return (
                            <div key={index} className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-4 flex gap-4">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ backgroundColor: config.bg }}
                                >
                                    <span className="material-symbols-outlined text-[18px]" style={{ color: config.color }}>
                                        {config.icon}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-semibold text-[#191c1d]">{config.label}</p>
                                        <p className="text-xs text-[#737687]">{formatDateTime(event.timestamp)}</p>
                                    </div>
                                    {renderPayload(event)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {hasNext && (
                <Button variant="outline" onClick={handleLoadMore} className="w-full mt-4">
                    더 보기
                </Button>
            )}
        </div>
    );
}

export default HistoryPage;
