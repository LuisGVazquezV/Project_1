import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { store } from "../../globalData/store";
import CustomNavbar from "../Navbar/Navbar";
import { Button, Table, Dropdown } from "react-bootstrap";
import "../../App.css";

export const EmployeeDashboard: React.FC = () => {
    const [reimbursements, setReimbursements] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const navigate = useNavigate();
    const user = store.loggedInUser;

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchReimbursements = async () => {
            try {
                const url = statusFilter === "ALL"
                    ? `http://localhost:8080/reimbursements/${user.userId}`
                    : `http://localhost:8080/reimbursements/${user.userId}/status/${statusFilter}`;
                const response = await axios.get(url, { withCredentials: true });
                setReimbursements(response.data);
            } catch (error) {
                console.error("Error fetching reimbursements:", error);
            }
        };

        fetchReimbursements();
    }, [statusFilter, user, navigate]);

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
    };

    const getStatusIndicatorClass = (status: string) => {
        switch (status) {
            case "PENDING":
                return "status-pending";
            case "APPROVED":
                return "status-approved";
            case "DENIED":
                return "status-denied";
            default:
                return "";
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <CustomNavbar />
            <div className="container mt-4">
                <div className="dashboard-header">
                    <h1>Employee Dashboard</h1>
                    <h2>Your Reimbursements</h2>
                    <Button
                    variant="primary"
                    onClick={() => navigate("/add-reimbursement")}
                    className="mb-3"
                    >
                    Add Reimbursement
                    </Button>
                    <Dropdown onSelect={(eventKey) => setStatusFilter(eventKey as string)} className="mb-3">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Status Filter
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="ALL">All</Dropdown.Item>
                            <Dropdown.Item eventKey="PENDING">Pending</Dropdown.Item>
                            <Dropdown.Item eventKey="APPROVED">Approved</Dropdown.Item>
                            <Dropdown.Item eventKey="DENIED">Denied</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </div>
                <Table striped bordered hover variant="dark">
                    <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th></th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reimbursements.map((reimbursement) => (
                        <tr key={reimbursement.reimbId}>
                            <td>{reimbursement.reimbId}</td>
                            <td>{reimbursement.description}</td>
                            <td>{formatCurrency(reimbursement.amount)}</td>
                            <td>{reimbursement.status}</td>
                            <td>
                                <span
                                    className={`status-indicator ${getStatusIndicatorClass(reimbursement.status)}`}
                                ></span>
                            </td>
                            <td style={{textAlign: "left"}}>
                                {reimbursement.status === 'PENDING' && (
                                    <Button
                                        variant="outline-info"
                                        onClick={() => navigate(`/update-description/${reimbursement.reimbId}`)}
                                    >
                                        Update Description
                                    </Button>
                                )}
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};
