import { useState, useEffect } from "react";
import type { HistoryEvent, WorkSessionPayload, EwaPayload, PayPeriodPayload } from "./types";
import { getHistories } from "./api";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    const renderPayload = (event: HistoryEvent) => {
        switch (event.eventType) {
            case "WORK_SESSION_START": {
                const p = event.historyPayload as WorkSessionPayload;
                return <p>출근 시각: {formatDateTime(p.clockIn)}</p>;
            }
            case "WORK_SESSION_END": {
                const p = event.historyPayload as WorkSessionPayload;
                return (
                    <div>
                        <p>퇴근 시각: {p.clockOut ? formatDateTime(p.clockOut) : "-"}</p>
                        <p>번 돈: ₩{p.earnedAmount.toLocaleString()}</p>
                    </div>
                );
            }
            case "EWA_REQUEST": {
                const p = event.historyPayload as EwaPayload;
                return (
                    <div>
                        <p>신청 금액: ₩{p.requestedAmount.toLocaleString()}</p>
                        <p>상태: {p.status}</p>
                        <p>신청 시각: {formatDateTime(p.createdAt)}</p>
                    </div>
                );
            }
            case "PAY_PERIOD_START": {
                const p = event.historyPayload as PayPeriodPayload;
                return <p>기간 시작일: {formatDate(p.payPeriodStart)}</p>;
            }
            case "PAY_PERIOD_END": {
                const p = event.historyPayload as PayPeriodPayload;
                return (
                    <div>
                        <p>기간 종료일: {p.payPeriodEnd ? formatDate(p.payPeriodEnd) : "-"}</p>
                        <p>총 번 돈: ₩{p.totalEarnedAmount.toLocaleString()}</p>
                        <p>선지급액: ₩{p.totalEwaAmount.toLocaleString()}</p>
                    </div>
                );
            }
        }
    }
    const formatDateTime = (dateStr: string) =>
        new Date(dateStr).toLocaleString("ko-KR", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
        });
    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("ko-KR", {
            year: "numeric", month: "2-digit", day: "2-digit"
        });

    const eventLabel: Record<string, string> = {
        PAY_PERIOD_START: "페이 피어리어드 시작",
        PAY_PERIOD_END: "페이 피어리어드 종료",
        WORK_SESSION_START: "출근",
        WORK_SESSION_END: "퇴근",
        EWA_REQUEST: "선지급 요청",
    };

    return (
        <div>
            {events.map((event, index) => (
                <div key={index}>
                    <p>[{eventLabel[event.eventType]}]</p>
                    {renderPayload(event)}
                </div>
            ))}
            {hasNext && <Button onClick={handleLoadMore}>더 보기</Button>}
        </div>
    )
}
export default HistoryPage;