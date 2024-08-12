import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { store } from "../../globalData/store";
import { Button, Container, Form, Row, Col, Card, Image } from "react-bootstrap";
import { useDarkMode } from "../../contexts/DarkmodeContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Login: React.FC = () => {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode(); // Get dark mode status

    const storeValues = (input: React.ChangeEvent<HTMLInputElement>) => {
        setUser((prev) => ({ ...prev, [input.target.name]: input.target.value }));
    };

    const login = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/auth", user, { withCredentials: true });
            const userData = response.data;

            // Update store
            store.loggedInUser = {
                userId: userData.userId,
                username: userData.username,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role
            };

            localStorage.setItem('loggedInUser', JSON.stringify(store.loggedInUser));

            if (userData.role === "Employee") {
                toast.success("Welcome " + userData.firstName + " " + userData.lastName + "! Login successful!");
                setTimeout(() => navigate("/employee-dashboard"), 2000); // 2-second delay
            } else if (userData.role === "Manager") {
                toast.success("Welcome " + userData.firstName + " " + userData.lastName + "! Login successful!");
                setTimeout(() => navigate("/manager-dashboard"), 2000); // 2-second delay
            } else {
                toast.error("Unexpected role. Please contact support.");
                setTimeout(() => navigate("/"), 2000); // 2-second delay
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    switch (error.response.status) {
                        case 400:
                            toast.error("Bad Request: Please check your input and try again.");
                            break;
                        case 401:
                            toast.error("Unauthorized: Incorrect username or password.");
                            break;
                        case 500:
                            toast.error("Server Error: Please try again later.");
                            break;
                        default:
                            toast.error("An unexpected error occurred. Please try again.");
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    toast.error("Network Error: Please check your connection and try again.");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    toast.error("Error: " + error.message);
                }
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Card className={`p-4 ${isDarkMode ? 'card-dark-mode' : 'card-light-mode'}`} style={{ maxWidth: '400px', width: '100%' }}>
                    <Card.Body>
                        <Image
                            src="https://img.icons8.com/?size=100&id=46777&format=png&color=000000"
                            fluid
                        />
                        <Card.Title className="text-center mb-4 text-light fs-1">ERS</Card.Title>
                        <Card.Subtitle className="text-center mb-4 text-light fs-5">Employee Reimbursement System</Card.Subtitle>
                        <Form onSubmit={(e) => { e.preventDefault(); login(); }}>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your username"
                                    name="username"
                                    onChange={storeValues}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mt-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    name="password"
                                    onChange={storeValues}
                                    required
                                />
                            </Form.Group>
                            <Row className="mt-4">
                                <Col>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-100"
                                        disabled={loading}
                                    >
                                        {loading ? "Logging in..." : "Login"}
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>
                                    <Button
                                        variant="secondary"
                                        className="w-100"
                                        onClick={() => navigate("/register")}
                                    >
                                        Create Account
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
            <ToastContainer />
        </div>
    );
};
