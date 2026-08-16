import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/workplaces");
        } else {
            navigate("/login");
        }
    }, []);

    return null;
}

export default HomePage;
