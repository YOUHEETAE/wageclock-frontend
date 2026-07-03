import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import EmploymentSelectPage from "./features/employment/EmploymentSelectPage";
import CreateEmploymentPage from "./features/employment/CreateEmploymentPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/employments" element={<EmploymentSelectPage />} />
      <Route path="/employments/new" element={<CreateEmploymentPage />} />
    </Routes>
  );
}

export default App;
