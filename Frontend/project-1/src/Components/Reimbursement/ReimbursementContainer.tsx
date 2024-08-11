import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Dropdown } from "react-bootstrap";
import { useDarkMode } from "../../contexts/DarkmodeContext"; // Import the dark mode context
import "../../App.css"; // Ensure this path is correct based on your project structure

export const ReimbursementContainer: React.FC = () => {
    const [reimbursements, setReimbursements] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const { isDarkMode } = useDarkMode(); // Get the dark mode state

    useEffect(() => {
        const fetchReimbursements = async () => {
            try {
                const url = statusFilter === "ALL"
                    ? "http://localhost:8080/reimbursements"
                    : `http://localhost:8080/reimbursements/status/${statusFilter}`;
                const response = await axios.get(url, { withCredentials: true });
                setReimbursements(response.data);
            } catch (error) {
                alert("Failed to fetch reimbursements.");
            }
        };

        fetchReimbursements();
    }, [statusFilter]);

    const handleUpdate = async (reimbursementId: number, newStatus: string) => {
        try {
            await axios.patch(`http://localhost:8080/reimbursements/${reimbursementId}`, { status: newStatus }, {
                withCredentials: true
            });
            setReimbursements(reimbursements.map(reimbursement =>
                reimbursement.reimbId === reimbursementId ? { ...reimbursement, status: newStatus } : reimbursement
            ));
        } catch (error) {
            console.error("Error updating reimbursement:", error);
        }
    };

    const handleUpdateDescription = async (reimbursementId: number, newDescription: string) => {
        try {
            await axios.patch(`http://localhost:8080/reimbursements/${reimbursementId}/description`, { description: newDescription }, {
                withCredentials: true
            });
            // Handle the update in the frontend
        } catch (error) {
            console.error("Error updating reimbursement description:", error);
        }
    };

    const handleDelete = async (reimbId: number) => {
        try {
            await axios.delete(`http://localhost:8080/reimbursements/${reimbId}`, {
                withCredentials: true
            });
            setReimbursements(reimbursements.filter(reimbursement => reimbursement.reimbId !== reimbId));
        } catch (error) {
            console.error("Error deleting reimbursement:", error);
        }
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

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
    };

    return (
        <div className="reimbursement-container">
            <div className="heading-section">
                <h2>All Reimbursements</h2>
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

            <Table striped bordered hover variant={isDarkMode ? "dark" : "primary"} className="mt-3">
                <thead>
                <tr>
                    <th>Reimbursement ID</th>
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
                        <td>
                            {reimbursement.status === 'PENDING' && (
                                <>
                                    <Button variant="outline-success"
                                            onClick={() => handleUpdate(reimbursement.reimbId, 'APPROVED')}
                                            className="action-button">Approve</Button>
                                    <Button variant="outline-danger"
                                            onClick={() => handleUpdate(reimbursement.reimbId, 'DENIED')}
                                            className="action-button">Deny</Button>
                                </>
                            )}
                            <Button
                                variant="outline-warning"
                                onClick={() => handleDelete(reimbursement.reimbId)}
                                className="action-button"
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};
