import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DashboardResponse } from "./types";
import { Button } from "@/components/ui/button";
import { getDashboard } from "./api";

function DashboardPage() {
    const { workplaceId } = useParams();
    const [workers, setWorkers] = useState<DashboardResponse[]>([]);
    useEffect(() => {
        getDashboard(Number(workplaceId)).then(setWorkers);
    }, []);
    const navigate = useNavigate();

    return (
        <div>
            {workers.map((worker) => (
                <div key={worker.employmentId}>
                    <p>{worker.workerName}</p>
                    <p>{worker.status}</p>
                    <p>{worker.todayEarnedAmount}</p>
                </div>
            ))}
            <Button onClick={() => navigate(`/workplaces/${workplaceId}/employments/new`)}>
                근로자 추가
            </Button>
        </div>
    )
}
export default DashboardPage;