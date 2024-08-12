import React, { useState } from "react";
import { FormControl, Button, Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useDarkMode } from "../../contexts/DarkmodeContext";
import './AddReimbursement.css';

export const AddReimbursement: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [descriptionError, setDescriptionError] = useState("");
    const [amountError, setAmountError] = useState("");
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode(); // Get dark mode status

    const validateForm = (description: string, amount: string): boolean => {
        let isValid = true;

        // Clear previous errors
        setDescriptionError("");
        setAmountError("");

        // Validate description
        if (/^\d+$/.test(description)) {
            toast.error("Description cannot be numbers only.");
            isValid = false;
        }

        // Validate amount
        const amountValue = parseFloat(amount);
        if (amountValue <= 0) {
            toast.error("Amount must be greater than zero.");
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const description = form.description.value;
        const amount = form.amount.value;

        // Validate input
        if (!validateForm(description, amount)) {
            return;
        }

        const newReimbursement = {
            description,
            amount: parseFloat(amount),
        };

        setLoading(true);
        try {
            await axios.post("http://localhost:8080/reimbursements", newReimbursement, {
                withCredentials: true
            });

            toast.success('Thank you for submitting. Please wait for a Manager to review your ticket.');
            setTimeout(() => {
                navigate("/employee-dashboard");
            }, 3000);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Handle specific HTTP errors
                    switch (error.response.status) {
                        case 400:
                            toast.error("Bad Request: Please check your input.");
                            break;
                        case 401:
                            toast.error("Unauthorized: Please log in.");
                            break;
                        case 500:
                            toast.error("Server Error: Please try again later.");
                            break;
                        default:
                            toast.error("An unexpected error occurred.");
                    }
                } else if (error.request) {
                    toast.error("Network Error: Please check your connection.");
                } else {
                    toast.error("Error: " + error.message);
                }
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <CustomNavbar />
            <ToastContainer />
            <Container className="mt-4">
                <h3 className="mb-4 text-center">Submit New Reimbursement Ticket:</h3>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className={`p-4 ${isDarkMode ? 'card-dark-mode' : 'card-light-mode'}`}>
                            <Card.Body>
                                <form onSubmit={handleSubmit}>
                                    <FormControl
                                        type="text"
                                        placeholder="Enter Description"
                                        name="description"
                                        required
                                        className="mb-3"
                                    />
                                    {descriptionError && (
                                        <div className="text-danger mb-3">{descriptionError}</div>
                                    )}
                                    <FormControl
                                        type="number"
                                        placeholder="Enter Amount"
                                        name="amount"
                                        required
                                        step="0.01"
                                        className="mb-3"
                                    />
                                    {amountError && (
                                        <div className="text-danger mb-3">{amountError}</div>
                                    )}
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-100"
                                        disabled={loading}
                                    >
                                        {loading ? "Submitting..." : "Submit"}
                                    </Button>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
