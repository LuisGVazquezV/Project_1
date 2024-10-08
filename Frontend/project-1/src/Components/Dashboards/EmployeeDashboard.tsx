import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { store } from "../../globalData/store";
import CustomNavbar from "../Navbar/Navbar";
import { Button, Table, Dropdown } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../../App.css";
import { useDarkMode } from "../../contexts/DarkmodeContext"; // Import the dark mode context

export const EmployeeDashboard: React.FC = () => {
    const [reimbursements, setReimbursements] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [editReimbId, setEditReimbId] = useState<number | null>(null);
    const [editDescription, setEditDescription] = useState<string>("");
    const navigate = useNavigate();
    const user = store.loggedInUser;
    const { isDarkMode } = useDarkMode(); // Get the dark mode state

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
                //toast.error("Failed to load reimbursements. Please try again later.");
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

    const handleUpdateDescription = async (reimbId: number) => {
        if (!editDescription.trim()) {
            toast.error("Description cannot be empty.");
            return;
        }

        if (/^\d+$/.test(editDescription.trim())) {
            toast.error("Description cannot be just numbers.");
            return;
        }

        try {
            await axios.patch(
                `http://localhost:8080/reimbursements/${reimbId}/description`,
                { description: editDescription },
                { withCredentials: true }
            );
            setReimbursements(reimbursements.map(reimbursement =>
                reimbursement.reimbId === reimbId ? { ...reimbursement, description: editDescription } : reimbursement
            ));
            toast.success("Description updated successfully!");
            setEditReimbId(null);
        } catch (error) {
            toast.error("Error updating reimbursement description.");
        }
    };

    return (
        <div>
            <CustomNavbar />
            <ToastContainer />
            <div className="container mt-4">
                <div className="dashboard-header">
                    <h1>Employee Dashboard</h1>
                    <h2>Your Reimbursement Tickets</h2>
                    <Button
                        variant="primary"
                        onClick={() => navigate("/add-reimbursement")}
                        className="mb-3"
                    >
                        Add Reimbursement
                    </Button>
                    <Dropdown onSelect={(eventKey) => setStatusFilter(eventKey as string)} className="mb-3">
                        <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
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
                <Table striped bordered hover variant={isDarkMode ? "dark" : "primary"}>
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
                    {reimbursements.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center">
                                 No Reimbursement Tickets Available With This Status. ({statusFilter})
                            </td>
                        </tr>
                    ) : (
                        reimbursements.map((reimbursement) => (
                            <tr key={reimbursement.reimbId}>
                                <td>{reimbursement.reimbId}</td>
                                <td>
                                    {editReimbId === reimbursement.reimbId ? (
                                        <input
                                            type="text"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                        />
                                    ) : (
                                        reimbursement.description
                                    )}
                                </td>
                                <td>{formatCurrency(reimbursement.amount)}</td>
                                <td>{reimbursement.status}</td>
                                <td>
                                        <span
                                            className={`status-indicator ${getStatusIndicatorClass(reimbursement.status)}`}
                                        ></span>
                                </td>
                                <td style={{ textAlign: "left" }}>
                                    {editReimbId === reimbursement.reimbId ? (
                                        <>
                                            <Button
                                                variant="success"
                                                onClick={() => handleUpdateDescription(reimbursement.reimbId)}
                                                className="me-2"
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => setEditReimbId(null)}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        reimbursement.status === "PENDING" && (
                                            <Button
                                                variant="outline-info"
                                                onClick={() => {
                                                    setEditReimbId(reimbursement.reimbId);
                                                    setEditDescription(reimbursement.description);
                                                }}
                                            >
                                                Update Description
                                            </Button>
                                        )
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};
