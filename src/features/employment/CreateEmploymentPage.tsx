import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEmployment } from "./api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function CreateEmploymentPage() {
    const [workerEmail, setWorkerEmail] = useState("");
    const [hourlyWage, setHourlyWage] = useState("");
    const { workplaceId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createEmployment({ workerEmail, hourlyWage: parseFloat(hourlyWage), workplaceId: Number(workplaceId) });
        navigate(`/dashboard/${workplaceId}`);
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

            <Button type="submit">고용관계 등록</Button>
        </form>
    )
}

export default CreateEmploymentPage;