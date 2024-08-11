import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Dropdown } from "react-bootstrap";

export const ReimbursementContainer: React.FC = () => {
    const [reimbursements, setReimbursements] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

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

    return (
        <div>
            <h2>All Reimbursements</h2>
            <Dropdown onSelect={(eventKey) => setStatusFilter(eventKey as string)}>
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

            <Table striped bordered hover variant="dark" className="mt-3">
                <thead>
                <tr>
                    <th>Reimbursement ID</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {reimbursements.map((reimbursement) => (
                    <tr key={reimbursement.reimbId}>
                        <td>{reimbursement.reimbId}</td>
                        <td>{reimbursement.description}</td>
                        <td>{reimbursement.amount}</td>
                        <td>{reimbursement.status}</td>
                        <td>
                            {reimbursement.status === 'PENDING' && (
                                <>
                                    <Button variant="outline-info" onClick={() => handleUpdate(reimbursement.reimbId, 'APPROVED')}>Approve</Button>
                                    <Button variant="outline-info" onClick={() => handleUpdate(reimbursement.reimbId, 'DENIED')}>Deny</Button>
                                </>
                            )}
                            <Button
                                variant="outline-danger"
                                onClick={() => handleDelete(reimbursement.reimbId)}
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
