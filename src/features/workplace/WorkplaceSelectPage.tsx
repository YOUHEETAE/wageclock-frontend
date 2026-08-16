import { useState, useEffect } from "react";
import type { WorkplaceResponse } from "./types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getWorkerWorkplaces, getEmployerWorkplaces } from "./api";

function WorkplaceSelectPage() {
    const [workplaces, setWorkplaces] = useState<WorkplaceResponse[]>([]);
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    useEffect(() => {
        if (role === "WORKER") {
            getWorkerWorkplaces().then(setWorkplaces);
        } else {
            getEmployerWorkplaces().then(setWorkplaces);
        }
    }, []);

    const handleSelect = (workplace: WorkplaceResponse) => {
        localStorage.setItem("workplace", JSON.stringify(workplace));
        if (role === "WORKER") {
            localStorage.setItem("employmentId", String(workplace.employmentId));
            navigate('/work-session', { state: { workplace } });
        } else {
            localStorage.setItem("workplaceId", String(workplace.workplaceId));
            navigate(`/dashboard/${workplace.workplaceId}`, { state: { workplace } });
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-[#191c1d] mb-2">직장 선택</h1>
            <p className="text-sm text-[#737687] mb-6">
                {role === "WORKER" ? "근무할 직장을 선택하세요." : "관리할 사업장을 선택하세요."}
            </p>
            <div className="flex flex-col gap-3">
                {workplaces.map((wp) => (
                    <button
                        key={wp.workplaceId}
                        onClick={() => handleSelect(wp)}
                        className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-5 text-left hover:border-[#004ecb] hover:shadow-[0_4px_20px_rgba(0,78,203,0.12)] transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[16px] font-semibold text-[#191c1d] group-hover:text-[#004ecb] transition-colors">{wp.name}</p>
                                <p className="text-sm text-[#737687] mt-0.5">{wp.address}</p>
                            </div>
                            <span className="material-symbols-outlined text-[#edeeef] group-hover:text-[#004ecb] transition-colors">chevron_right</span>
                        </div>
                    </button>
                ))}
            </div>
            {role === "EMPLOYER" && (
                <Button
                    variant="outline"
                    onClick={() => navigate("/workplaces/new")}
                    className="w-full mt-4"
                >
                    <span className="material-symbols-outlined text-[18px] mr-1">add</span>
                    새 사업장 추가
                </Button>
            )}
        </div>
    );
}

export default WorkplaceSelectPage;
