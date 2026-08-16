import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import WorkplaceSelectPage from "./features/workplace/WorkplaceSelectPage";
import CreateWorkplacePage from "./features/workplace/CreateWorkplacePage";
import CreateEmploymentPage from "./features/employment/CreateEmploymentPage";
import WorkSessionPage from "./features/worksession/WorkSessionPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import PayPeriodSummaryPage from "./features/payperiod/PayPeriodSummaryPage";
import PayPeriodListPage from "./features/payperiod/PayPeriodListPage";
import EwaRequestPage from "./features/ewaRequest/EwaRequestPage";
import EwaPendingPage from "./features/ewaRequest/EwaPendingPage";
import SettlementPage from "./features/settlement/SettlementPage";
import HistoryPage from "./features/history/HistoryPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/workplaces" element={<WorkplaceSelectPage />} />
        <Route path="/workplaces/new" element={<CreateWorkplacePage />} />
        <Route path="/workplaces/:workplaceId/employments/new" element={<CreateEmploymentPage />} />
        <Route path="/work-session" element={<WorkSessionPage />} />
        <Route path="/dashboard/:workplaceId" element={<DashboardPage />} />
        <Route path="/pay-period/:employmentId" element={<PayPeriodSummaryPage />} />
        <Route path="/workplaces/:workplaceId/pay-periods" element={<PayPeriodListPage />} />
        <Route path="/ewa-request" element={<EwaRequestPage />} />
        <Route path="/ewa-pending" element={<EwaPendingPage />} />
        <Route path="/settlement" element={<SettlementPage />} />
        <Route path="/history/:employmentId" element={<HistoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;
