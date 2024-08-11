import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EmployeeDashboard } from "./Components/Dashboards/EmployeeDashboard";
import { ManagerDashboard } from "./Components/Dashboards/ManagerDashboard";
import { Login } from "./Components/LoginRegister/Login";
import { Register } from "./Components/LoginRegister/Register";
import { AddReimbursement } from "./Components/Reimbursement/AddReimbursement";
import { UserProfile } from "./Components/User/UserProfile";
import { DarkModeProvider, useDarkMode } from './contexts/DarkmodeContext'; // Update the import path as necessary
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Ensure this file contains your dark mode styles

const AppContent: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    return (
        <div className="App">
            <div className="dark-mode-toggle-container">
                <label className="switch">
                    <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
                    <span className="slider"></span>
                </label>
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                    <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                    <Route path="/add-reimbursement" element={<AddReimbursement />} />
                    <Route path="/user-profile" element={<UserProfile />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

function App() {
    return (
        <DarkModeProvider>
            <AppContent />
        </DarkModeProvider>
    );
}

export default App;
