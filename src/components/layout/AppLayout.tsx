import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AppLayout() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="ml-56 flex-1 overflow-auto p-8 bg-[#f8f9fa]">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;
