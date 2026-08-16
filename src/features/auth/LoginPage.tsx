import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "./api";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await login({ email, password });
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        localStorage.setItem("userName", response.name);
        navigate("/workplaces");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
            <div className="w-full max-w-sm px-4">
                <div className="text-center mb-8">
                    <h1 className="text-[28px] font-bold text-[#004ecb]">WageClock</h1>
                    <p className="text-sm text-[#737687] mt-1">근무 시간 관리 솔루션</p>
                </div>
                <div className="bg-white rounded-2xl border border-[#edeeef] shadow-[0_4px_20px_rgba(0,78,203,0.06)] p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                        <Button type="submit" className="w-full mt-2">로그인</Button>
                    </form>
                    <p className="text-center text-sm text-[#737687] mt-6">
                        계정이 없으신가요?{" "}
                        <button onClick={() => navigate("/sign-up")} className="text-[#004ecb] font-medium hover:underline">
                            회원가입
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
