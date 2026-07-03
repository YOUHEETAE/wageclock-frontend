import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployment } from "./api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function CreateEmploymentPage() {
    const [workerEmail, setWorkerEmail] = useState("");
    const [hourlyWage, setHourlyWage] = useState("");
    const [employmentName, setEmploymentName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createEmployment({ workerEmail, hourlyWage: parseFloat(hourlyWage), employmentName });
        navigate("/employments");
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                type="email"
                placeholder="이메일"
                value={workerEmail}
                onChange={(e) => setWorkerEmail(e.target.value)}
            />

            <Input
                type="number"
                placeholder="시급"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(e.target.value)}
            />

            <Input
                type="text"
                placeholder="사업장 이름"
                value={employmentName}
                onChange={(e) => setEmploymentName(e.target.value)}
            />

            <Button type="submit">사업장 등록</Button>
        </form>
    )
}

export default CreateEmploymentPage;