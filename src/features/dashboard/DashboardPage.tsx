import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DashboardResponse } from "./types";
import { Button } from "@/components/ui/button";
import { getDashboard } from "./api";
import type { PendingEwaResponse } from "../ewaRequest/types";
import { getPendingEwaRequests } from "../ewaRequest/api";

const POLL_INTERVAL = 5000;

function calcCurrentEarned(worker: DashboardResponse): number {
    if (worker.status !== "WORKING" || !worker.lastResumeAt || worker.earnedAmount == null) {
        return worker.earnedAmount ?? 0;
    }
    const secondsElapsed = (Date.now() - new Date(worker.lastResumeAt).getTime()) / 1000;
    return worker.earnedAmount + (worker.hourlyWage * secondsElapsed) / 3600;
}

function formatTimer(worker: DashboardResponse): string {
    if (!worker.status || worker.status === "COMPLETED") return "00:00:00";
    const earned = calcCurrentEarned(worker);
    const totalSeconds = Math.floor((earned / worker.hourlyWage) * 3600);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function DashboardPage() {
    const { workplaceId } = useParams();
    const [workers, setWorkers] = useState<DashboardResponse[]>([]);
    const [_tick, setTick] = useState(0);
    const [pendingEwaList, setPendingEwaList] = useState<PendingEwaResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            const [dashboardData, ewaData] = await Promise.all([
                getDashboard(Number(workplaceId)),
                getPendingEwaRequests(Number(workplaceId))
            ]);
            setWorkers(dashboardData);
            setPendingEwaList(ewaData);
        };
        fetchAll();

        const poll = setInterval(fetchAll, POLL_INTERVAL)

        const timer = setInterval(() => {
            setTick((t) => t + 1);
        }, 1000);

        return () => {
            clearInterval(poll);
            clearInterval(timer);
        };
    }, []);

    return (
        <div>
            {workers.map((worker) => {
                const pendingEwa = pendingEwaList.find(e => e.employmentId === worker.employmentId);
                return (
                    <div key={worker.employmentId}>
                        <p>{worker.workerName}</p>
                        <p>{worker.status ?? "대기 중"}</p>
                        <p>{formatTimer(worker)}</p>
                        <p>₩{Math.floor(calcCurrentEarned(worker)).toLocaleString()}</p>
                        <p>선지급액: {worker.todayEwaAmount}</p>
                        {pendingEwa && (
                            <Button onClick={() => navigate("/ewa-pending", { state: { ewa: pendingEwa } })}>
                                요청 대기중
                            </Button>
                        )}
                    </div>
                );
            })}
            <Button onClick={() => navigate(`/workplaces/${workplaceId}/employments/new`)}>
                근로자 추가
            </Button>
            <Button onClick={() => navigate(`/workplaces/${workplaceId}/pay-periods`)}>
                정산 관리
            </Button>
        </div>
    );
}
export default DashboardPage;
