import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkerEmployments, getEmployerEmployments } from "./api";
import type { EmploymentResponse } from "./types";
import { Button } from "@/components/ui/button";


function EmploymentSelectPage() {

    const [employments, setEmployments] = useState<EmploymentResponse[]>([]);
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    useEffect(() => {
        if (role == "WORKER") {
            getWorkerEmployments().then(setEmployments);
        } else {
            getEmployerEmployments().then(setEmployments);
        }
    }, [])

    const handleSelect = (employment: EmploymentResponse) => {
        if (role === "WORKER") {
            navigate('/work-session', { state: { employment } });
        } else {
            navigate(`/dashboard/${employment.employmentId}`, { state: { employment } });
        }
    };

    return (
        <div>
            <h1>제목</h1>
            {employments.map((emp) => (
                <Button key={emp.employmentId} onClick={() => handleSelect(emp)}>
                    {emp.employmentName}
                </Button>
            ))}
            {role === "EMPLOYER" && (
                <Button onClick={() => navigate("/employments/new")}>새 사업장 추가</Button>
            )}
        </div>
    )
}

export default EmploymentSelectPage;