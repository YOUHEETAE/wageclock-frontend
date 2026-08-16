import { useNavigate, useLocation } from "react-router-dom";

interface MenuItem {
    label: string;
    icon: string;
    matchPath: string;
    onClick: () => void;
}

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role");
    const userName = localStorage.getItem("userName");
    const employmentId = localStorage.getItem("employmentId");
    const workplaceId = localStorage.getItem("workplaceId");

    const handleWorkSession = () => {
        const stored = localStorage.getItem("workplace");
        if (stored) {
            navigate("/work-session", { state: { workplace: JSON.parse(stored) } });
        } else {
            navigate("/workplaces");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const workerMenus: MenuItem[] = [
        { label: "직장 선택", icon: "home", matchPath: "/workplaces", onClick: () => navigate("/workplaces") },
        { label: "출퇴근", icon: "schedule", matchPath: "/work-session", onClick: handleWorkSession },
        { label: "기간 현황", icon: "payments", matchPath: "/pay-period", onClick: () => navigate(`/pay-period/${employmentId}`) },
        { label: "이력", icon: "history", matchPath: "/history", onClick: () => navigate(`/history/${employmentId}`) },
    ];

    const employerMenus: MenuItem[] = [
        { label: "직장 선택", icon: "home", matchPath: "/workplaces", onClick: () => navigate("/workplaces") },
        { label: "대시보드", icon: "dashboard", matchPath: "/dashboard", onClick: () => navigate(`/dashboard/${workplaceId}`) },
        { label: "근로자 현황", icon: "group", matchPath: "/workplaces", onClick: () => navigate(`/workplaces/${workplaceId}/pay-periods`) },
    ];

    const menus = role === "WORKER" ? workerMenus : employerMenus;

    const isActive = (matchPath: string) => {
        if (matchPath === "/workplaces") return location.pathname === "/workplaces";
        return location.pathname.startsWith(matchPath);
    };

    return (
        <aside className="w-56 h-screen flex flex-col bg-white border-r border-[#edeeef] fixed left-0 top-0 z-40">
            <div className="h-16 flex items-center px-6 border-b border-[#edeeef]">
                <span className="text-[18px] font-bold text-[#004ecb]">WageClock</span>
            </div>

            <div className="px-4 py-4 border-b border-[#edeeef]">
                <div className="text-[14px] font-semibold text-[#191c1d]">{userName}</div>
                <div className="text-[12px] text-[#737687] mt-0.5">{role === "WORKER" ? "근로자" : "고용주"}</div>
            </div>

            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {menus.map((menu) => (
                    <button
                        key={menu.label}
                        onClick={menu.onClick}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left w-full text-[14px] font-medium transition-colors
                            ${isActive(menu.matchPath)
                                ? "bg-[#d7e2ff] text-[#004ecb]"
                                : "text-[#737687] hover:bg-[#f8f9fa] hover:text-[#191c1d]"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">{menu.icon}</span>
                        {menu.label}
                    </button>
                ))}
            </nav>

            <div className="px-3 pb-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left w-full text-[14px] font-medium text-[#737687] hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    로그아웃
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
