import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EmployeeDashboard } from "./Components/Dashboards/EmployeeDashboard";
import { ManagerDashboard } from "./Components/Dashboards/ManagerDashboard";
import { Login } from "./Components/LoginRegister/Login";
import { Register } from "./Components/LoginRegister/Register";
import {AddReimbursement} from "./Components/Reimbursement/AddReimbursement";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                    <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                    <Route path={"/add-reimbursement"} element={<AddReimbursement />} />
                    {/* Add other routes as needed */}
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
