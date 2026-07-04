import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import WorkplaceSelectPage from "./features/workplace/WorkplaceSelectPage";
import CreateWorkplacePage from "./features/workplace/CreateWorkplacePage";
import CreateEmploymentPage from "./features/employment/CreateEmploymentPage";
import WorkSessionPage from "./features/worksession/WorkSessionPage";
import DashboardPage from "./features/dashboard/dashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/workplaces" element={<WorkplaceSelectPage />} />
      <Route path="/workplaces/new" element={<CreateWorkplacePage />} />
      <Route path="/workplaces/:workplaceId/employments/new" element={<CreateEmploymentPage />} />
      <Route path="/work-session" element={<WorkSessionPage />} />
      <Route path="/dashboard/:workplaceId" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
