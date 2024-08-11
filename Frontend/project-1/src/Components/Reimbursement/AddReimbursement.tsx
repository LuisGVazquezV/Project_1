import { FormControl, Button } from "react-bootstrap";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../Navbar/Navbar";

export const AddReimbursement: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const newReimbursement = {
            description: form.description.value,
            amount: parseFloat(form.amount.value),
            // status is omitted as it's defaulted to 'PENDING'
        };
        try {
            await axios.post("http://localhost:8080/reimbursements", newReimbursement, {
                withCredentials: true
            });
            // Show alert message
            alert('Thank you for submitting. Wait for Manager to resolve.');
            // Redirect to the employee dashboard
            navigate("/employee-dashboard"); // Update this path if necessary
        } catch (error) {
            console.error("Error creating reimbursement:", error);
        }
    };

    return (
        <div>
            <CustomNavbar />
            <div className="container">
                <h3>Enter New Reimbursement Info:</h3>
                <form onSubmit={handleSubmit}>
                    <FormControl
                        type="text"
                        placeholder="Enter Description"
                        name="description"
                        required
                    />
                    <FormControl
                        type="number"
                        placeholder="Enter Amount"
                        name="amount"
                        required
                        step="0.01" // Allows decimal values
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </div>
    );
};
