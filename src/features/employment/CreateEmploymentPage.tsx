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
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-[#191c1d] mb-2">근로자 추가</h1>
            <p className="text-sm text-[#737687] mb-6">근로자 이메일과 시급을 입력하세요.</p>

            <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#191c1d]">근로자 이메일</label>
                        <Input
                            type="email"
                            placeholder="worker@example.com"
                            value={workerEmail}
                            onChange={(e) => setWorkerEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#191c1d]">시급</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#737687]">₩</span>
                            <Input
                                type="number"
                                placeholder="10,030"
                                value={hourlyWage}
                                onChange={(e) => setHourlyWage(e.target.value)}
                                className="pl-7"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full mt-2 h-12 text-base font-semibold">
                        고용관계 등록
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default CreateEmploymentPage;
