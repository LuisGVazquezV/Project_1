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

    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode(); // Get dark mode status

    const storeValues = (input: React.ChangeEvent<HTMLInputElement>) => {
        setUser((prev) => ({ ...prev, [input.target.name]: input.target.value }));
    };

    const login = async () => {
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
                toast.success("Welcome " + userData.firstName +" "+ userData.lastName + " ! Login successful!");
                setTimeout(() => navigate("/employee-dashboard"), 2000); // 2-second delay
            } else if (userData.role === "Manager") {
                toast.success("Welcome " + userData.firstName +" "+ userData.lastName + " ! Login successful!");
                setTimeout(() => navigate("/manager-dashboard"), 2000); // 2-second delay
            } else {
                toast.error("Please log in");
                setTimeout(() => navigate("/"), 2000); // 2-second delay
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Login failed! Please input correct username and password");
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
                                >
                                    Login
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
