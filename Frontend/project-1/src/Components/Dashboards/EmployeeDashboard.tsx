import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { store } from "../../globalData/store";
import CustomNavbar from "../Navbar/Navbar";
import {Button} from "react-bootstrap";

export const EmployeeDashboard: React.FC = () => {
    const [reimbursements, setReimbursements] = useState<any[]>([]);
    const navigate = useNavigate();
    const user = store.loggedInUser;

    useEffect(() => {
        if (!user) {
            navigate("/login"); // Redirect to login if user is not logged in
            return;
        }

        const fetchReimbursements = async () => {
            try {
                const userId = user.userId; // Access userId correctly
                const response = await axios.get(`http://localhost:8080/reimbursements/${userId}`, { withCredentials: true });
                setReimbursements(response.data);
            } catch (error) {
                alert("Failed to fetch reimbursements.");
            }
        };

        fetchReimbursements();
    }, [user, navigate]);

    if (!user) {
        return <div>Loading...</div>; // Display loading or placeholder while user info is being fetched
    }

    return (
        <div>
            <CustomNavbar /> {/* Render the EmployeeNavbar */}
            <div className="container mt-4">
                <h1>Employee Dashboard</h1>
                <h2>Your Reimbursements</h2>
                <Button
                    variant="primary"
                    onClick={() => navigate("/add-reimbursement")}
                    className="mb-3"
                >
                    Add Reimbursement
                </Button>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reimbursements.map((reimbursement) => (
                        <tr key={reimbursement.reimbId}>
                            <td>{reimbursement.description}</td>
                            <td>{reimbursement.amount}</td>
                            <td>{reimbursement.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
