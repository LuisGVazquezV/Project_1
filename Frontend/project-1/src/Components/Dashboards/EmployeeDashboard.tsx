import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { store } from "../../globalData/store";
import CustomNavbar from "../Navbar/Navbar";


export const EmployeeDashboard: React.FC = () => {
    const [reimbursements, setReimbursements] = useState<any[]>([]);
    const navigate = useNavigate();
    const role = store.loggedInUser.role;

    useEffect(() => {
        const fetchReimbursements = async () => {
            try {
                const userId = store.loggedInUser.id;
                const response = await axios.get(`http://localhost:8080/reimbursements/${userId}`, { withCredentials: true });
                setReimbursements(response.data);
            } catch (error) {
                alert("Failed to fetch reimbursements.");
            }
        };

        fetchReimbursements();
    }, []);

    return (
        <div>
            <CustomNavbar /> {/* Render the EmployeeNavbar */}
            <div className="container mt-4">
                <h1>Employee Dashboard</h1>
                <h2>Your Reimbursements</h2>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reimbursements.map((reimbursement) => (
                        <tr key={reimbursement.id}>
                            <td>{reimbursement.description}</td>
                            <td>{reimbursement.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
