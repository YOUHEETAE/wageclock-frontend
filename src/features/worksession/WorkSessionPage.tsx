import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clockIn, clockOut, pause, resume, getCurrentSession } from "./api";
import type { WorkplaceResponse } from "../workplace/types";
import { Button } from "@/components/ui/button";
import type { CurrentSessionResponse } from "./types";


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

function WorkSessionPage() {
    const [session, setSession] = useState<CurrentSessionResponse | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [_tick, setTick] = useState(0);
    const workplace: WorkplaceResponse = location.state.workplace;

    useEffect(() => {
        getCurrentSession(workplace.employmentId!).then((session) => {
            if (session) {
                setSession(session)
            }
        });
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
    }
    const handleClockOut = async () => {
        await clockOut({ sessionId: session!.sessionId });
        setSession(null);
    }
    const handlePause = async () => {
        const response = await pause({ sessionId: session!.sessionId });
        setSession(prev => ({ ...prev!, status: "PAUSED", earnedAmount: response.earnedAmount }));
    }
    const handleResume = async () => {
        const response = await resume({ sessionId: session!.sessionId })
        setSession(prev => ({ ...prev!, status: "WORKING", lastResumeAt: response.lastResumeAt }));
    }

    return (
        <div>
            <h1>{workplace.name}</h1>
            <p>{formatTimer(session)}</p>
            {session === null && (
                <Button onClick={handleClockIn}>출근</Button>
            )}
            {session !== null && (
                <div>
                    <p>₩{Math.floor(calcCurrentEarned(session)).toLocaleString()}</p>
                    {session!.status === "WORKING" && (
                        <div>
                            <Button onClick={handleClockOut}>퇴근</Button>
                            <Button onClick={handlePause}>일시정지</Button>
                        </div>
                    )}
                    {session!.status === "PAUSED" && (
                        <div>
                            <Button onClick={handleClockOut}>퇴근</Button>
                            <Button onClick={handleResume}>재개</Button>
                        </div>
                    )}
                </div>
            )}
            <Button onClick={() => navigate(`/pay-period/${workplace.employmentId}`)}>이번 기간 현황</Button>
        </div>
    )
}

export default WorkSessionPage;
