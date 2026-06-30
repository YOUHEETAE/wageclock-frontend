import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signup } from "./api";

function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"WORKER" | "EMPLOYER">("WORKER");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await signup({ name, email, password, role });
        navigate("/");
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <label>
                <input
                    type="radio"
                    name="role"
                    value="WORKER"
                    checked={role === "WORKER"}
                    onChange={() => setRole("WORKER")}
                />
                직원
            </label>

            <label>
                <input
                    type="radio"
                    name="role"
                    value="EMPLOYER"
                    checked={role === "EMPLOYER"}
                    onChange={() => setRole("EMPLOYER")}
                />
                고용주
            </label>

            <Button type="submit">회원가입</Button>


        </form>
    )
}

export default SignupPage;