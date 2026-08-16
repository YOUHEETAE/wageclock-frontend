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
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
            <div className="w-full max-w-sm px-4">
                <div className="text-center mb-8">
                    <h1 className="text-[28px] font-bold text-[#004ecb]">WageClock</h1>
                    <p className="text-sm text-[#737687] mt-1">회원가입</p>
                </div>
                <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#191c1d]">이름</label>
                            <Input
                                type="text"
                                placeholder="홍길동"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#191c1d]">이메일</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#191c1d]">비밀번호</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#191c1d]">역할</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(["WORKER", "EMPLOYER"] as const).map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`py-2.5 rounded-xl text-sm font-medium border transition-colors
                                            ${role === r
                                                ? "bg-[#004ecb] text-white border-[#004ecb]"
                                                : "bg-white text-[#737687] border-[#edeeef] hover:border-[#004ecb]"
                                            }`}
                                    >
                                        {r === "WORKER" ? "근로자" : "고용주"}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button type="submit" className="w-full mt-2">회원가입</Button>
                    </form>
                    <p className="text-center text-sm text-[#737687] mt-6">
                        이미 계정이 있으신가요?{" "}
                        <button onClick={() => navigate("/login")} className="text-[#004ecb] font-medium hover:underline">
                            로그인
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;
