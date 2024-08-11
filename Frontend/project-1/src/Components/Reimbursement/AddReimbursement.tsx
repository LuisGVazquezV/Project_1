import { FormControl, Button } from "react-bootstrap";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { store } from "../../globalData/store";

export const AddReimbursement: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const newReimbursement = {
            description: form.description.value,
            amount: parseFloat(form.amount.value),
            status: form.status.value
        };
        try {
            await axios.post("http://localhost:8080/reimbursements", newReimbursement, {
                withCredentials: true
            });
            navigate("/reimbursements");
        } catch (error) {
            console.error("Error creating reimbursement:", error);
        }
    };

    return (
        <div className="container">
            <h3>Enter New Reimbursement Info:</h3>
            <form onSubmit={handleSubmit}>
                <FormControl type="text" placeholder="Enter Description" name="description" required />
                <FormControl type="number" placeholder="Enter Amount" name="amount" required />
                <FormControl type="text" placeholder="Enter Status" name="status" required />
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};
