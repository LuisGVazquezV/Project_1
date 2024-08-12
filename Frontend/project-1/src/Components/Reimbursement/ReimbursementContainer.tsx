import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDarkMode } from "../../contexts/DarkmodeContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../../App.css";

export const ReimbursementContainer: React.FC = () => {
    const [reimbursements, setReimbursements] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        const fetchReimbursements = async () => {
            try {
                const url = statusFilter === "ALL"
                    ? "http://localhost:8080/reimbursements"
                    : `http://localhost:8080/reimbursements/status/${statusFilter}`;
                const response = await axios.get(url, { withCredentials: true });
                setReimbursements(response.data);
            } catch (error) {
                console.log("Error fetching reimbursements:", error);
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
            toast.success(`Ticket resolved. Reimbursement was ${newStatus.toLowerCase()}.`);
        } catch (error) {
            toast.error("Error updating reimbursement.");
        }
    };

    const handleUpdateDescription = async (reimbursementId: number, newDescription: string) => {
        try {
            await axios.patch(`http://localhost:8080/reimbursements/${reimbursementId}/description`, { description: newDescription }, {
                withCredentials: true
            });
            toast.success("Description updated successfully!");
        } catch (error) {
            toast.error("Error updating reimbursement description.");
        }
    };

    const handleDelete = async (reimbId: number) => {
        try {
            await axios.delete(`http://localhost:8080/reimbursements/${reimbId}`, {
                withCredentials: true
            });
            setReimbursements(reimbursements.filter(reimbursement => reimbursement.reimbId !== reimbId));
            toast.success("Reimbursement deleted successfully!");
        } catch (error) {
            toast.error("Error deleting reimbursement.");
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
            <ToastContainer />
            <div className="heading-section">
                <h2>All Reimbursement Tickets</h2>
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
                    <th>User ID</th>
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
                        <td>
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-user-${reimbursement.user.userId}`}>
                                        <div>
                                            <strong>User ID:</strong> {reimbursement.user.userId}<br />
                                            <strong>First Name:</strong> {reimbursement.user.firstName}<br />
                                            <strong>Last Name:</strong> {reimbursement.user.lastName}<br />
                                            <strong>Username:</strong> {reimbursement.user.username}
                                        </div>
                                    </Tooltip>
                                }
                            >
                                <span className="user-id">{reimbursement.user.userId}</span>
                            </OverlayTrigger>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};
