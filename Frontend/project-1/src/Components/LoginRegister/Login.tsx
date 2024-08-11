import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { store } from "../../globalData/store";
import { Button, Container, Form, Row, Col, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export const Login: React.FC = () => {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

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

            // Persist user details in localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(store.loggedInUser));

            // Navigate based on the user's role
            if (userData.role === "Employee") {
                navigate("/employee-dashboard");
            } else if (userData.role === "Manager") {
                navigate("/manager-dashboard");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed! Please try again.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Login</Card.Title>
                    <Form>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your username"
                                name="username"
                                onChange={storeValues}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                                onChange={storeValues}
                            />
                        </Form.Group>
                        <Row className="mt-4">
                            <Col>
                                <Button
                                    variant="primary"
                                    className="w-100"
                                    onClick={login}
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
    );
};
