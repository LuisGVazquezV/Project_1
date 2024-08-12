import React from "react";
import { FormControl, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const AddReimbursement: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const newReimbursement = {
            description: form.description.value,
            amount: parseFloat(form.amount.value),

        };
        try {
            await axios.post("http://localhost:8080/reimbursements", newReimbursement, {
                withCredentials: true
            });

            toast.success('Thank you for submitting. Please wait  for a Manager to review your ticket.');


            setTimeout(() => {
                navigate("/employee-dashboard");
            }, 3000);
        } catch (error) {
            console.error("Error creating reimbursement:", error);
            toast.error('Failed to submit reimbursement. Please try again.');
        }
    };

    return (
        <div>
            <CustomNavbar />
            <ToastContainer />
            <Container className="mt-4">
                <h3 className="mb-4">Submit New Reimbursement Ticket:</h3>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <form onSubmit={handleSubmit}>
                            <FormControl
                                type="text"
                                placeholder="Enter Description"
                                name="description"
                                required
                                className="mb-3"
                            />
                            <FormControl
                                type="number"
                                placeholder="Enter Amount"
                                name="amount"
                                required
                                step="0.01"
                                className="mb-3"
                            />
                            <Button type="submit" variant="primary" className="w-100">
                                Submit
                            </Button>
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
