import { Button, Table } from "react-bootstrap";
/*import { ReimbursementInterface } from "../../interfaces/ReimbursementInterface";
import { useEffect } from "react";
import { store } from "../../globalData/store";
import axios from "axios";

export const Reimbursement: React.FC<{ reimbursements: ReimbursementInterface[] }> = ({ reimbursements }) => {

    const handleUpdate = async (reimbursementId: number, newStatus: string) => {
        try {
            await axios.patch(`http://localhost:8080/reimbursements/${reimbursementId}`, { status: newStatus }, {
                withCredentials: true
            });
            // Optionally refetch data or update local state
        } catch (error) {
            console.error("Error updating reimbursement:", error);
        }
    };

    const handleDelete = async (reimbursementId: number) => {
        try {
            await axios.delete(`http://localhost:8080/reimbursements/${reimbursementId}`, {
                withCredentials: true
            });
            // Optionally refetch data or update local state
        } catch (error) {
            console.error("Error deleting reimbursement:", error);
        }
    };

    useEffect(() => {
        console.log(reimbursements);
    }, [reimbursements]);

    return (
        <div className="container">
            <h3>{store.loggedInUser.username}'s Reimbursements:</h3>
            <Table striped bordered hover variant="dark">
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
                                    <Button variant="outline-info" onClick={() => handleUpdate(reimbursement.reimbId!, 'APPROVED')}>Approve</Button>
                                    <Button variant="outline-info" onClick={() => handleUpdate(reimbursement.reimbId!, 'DENIED')}>Deny</Button>
                                </>
                            )}
                            {reimbursement.reimbId !== undefined && (
                                <Button
                                    variant="outline-danger"
                                    onClick={() => {
                                        if (reimbursement.reimbId !== undefined) {
                                            handleDelete(reimbursement.reimbId);
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};*/
