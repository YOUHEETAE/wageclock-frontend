import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clockIn, clockOut, pause, resume, getCurrentSession } from "./api";
import type { WorkplaceResponse } from "../workplace/types";
import { Button } from "@/components/ui/button";

function WorkSessionPage() {
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [status, setStatus] = useState<"WORKING" | "PAUSED" | "COMPLETED" | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const workplace: WorkplaceResponse = location.state.workplace;

    useEffect(() => {
        getCurrentSession(workplace.employmentId!).then((session) => {
            if (session) {
                setSessionId(session.sessionId);
                setStatus(session.status);
            }
        });
    }, []);

    const handleClockIn = async () => {
        const response = await clockIn({ employmentId: workplace.employmentId! });
        setSessionId(response.sessionId);
        setStatus("WORKING");
    }
    const handleClockOut = async () => {
        await clockOut({ sessionId: sessionId! });
        setStatus("COMPLETED");
    }
    const handlePause = async () => {
        await pause({ sessionId: sessionId! });
        setStatus("PAUSED")
    }
    const handleResume = async () => {
        await resume({ sessionId: sessionId! })
        setStatus("WORKING");
    }

    return (
        <div>
            <h1>{workplace.name}</h1>
            {sessionId === null && (
                <Button onClick={handleClockIn}>출근</Button>
            )}
            {status === "WORKING" && (
                <div>
                    <Button onClick={handleClockOut}>퇴근</Button>
                    <Button onClick={handlePause}>일시정지</Button>
                </div>
            )}
            {status === "PAUSED" && (
                <div>
                    <Button onClick={handleClockOut}>퇴근</Button>
                    <Button onClick={handleResume}>재개</Button>
                </div>
            )}
            {status === "COMPLETED" && (
                <p>퇴근 완료!</p>
            )}
            <Button onClick={() => navigate("/ewa-request", { state: { workplace } })}>선지급 요청</Button>
        </div>
    )
}

export default WorkSessionPage;
