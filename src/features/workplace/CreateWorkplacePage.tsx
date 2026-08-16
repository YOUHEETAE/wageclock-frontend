import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorkplace } from "./api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function CreateWorkplacePage() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createWorkplace({ name, address });
        navigate("/workplaces");
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-[#191c1d] mb-2">새 사업장 추가</h1>
            <p className="text-sm text-[#737687] mb-6">사업장 정보를 입력하세요.</p>

            <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#191c1d]">사업장 이름</label>
                        <Input
                            type="text"
                            placeholder="예) 스타벅스 강남점"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#191c1d]">주소</label>
                        <Input
                            type="text"
                            placeholder="예) 서울시 강남구 ..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full mt-2 h-12 text-base font-semibold">
                        사업장 등록
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default CreateWorkplacePage;
