import { useState, useEffect } from "react";
import type { WorkplaceResponse } from "./types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getWorkerWorkplaces, getEmployerWorkplaces } from "./api";


function WorkplaceSelectPage() {
    const [workplaces, setWorkplaces] = useState<WorkplaceResponse[]>([]);
    const role = localStorage.getItem("role");
    useEffect(() => {
        if (role === "WORKER") {
            getWorkerWorkplaces().then(setWorkplaces);
        } else {
            getEmployerWorkplaces().then(setWorkplaces);
        }
    }, []);
    const navigate = useNavigate();




    const handleSelect = (workplace: WorkplaceResponse) => {
        if (role === "WORKER") {
            navigate('/work-session', { state: { workplace } });
        } else {
            navigate(`/dashboard/${workplace.workplaceId}`, { state: { workplace } });
        }
    }

    return (
        <div>
            {workplaces.map((wp) => (
                <Button key={wp.workplaceId} onClick={() => handleSelect(wp)}>
                    {wp.name}
                </Button>
            ))}
            {role === "EMPLOYER" && (
                <Button onClick={() => navigate("/workplaces/new")}>
                    새 사업장 추가
                </Button>
            )}
        </div>
    )

}

export default WorkplaceSelectPage;