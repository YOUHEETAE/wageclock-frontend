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
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input
                type="text"
                placeholder="사업장 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <Input
                type="text"
                placeholder="사업장 주소"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />

            <Button type="submit">사업장 등록</Button>
        </form>
    )
}
export default CreateWorkplacePage;