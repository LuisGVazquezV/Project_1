import React, { useEffect, useState } from "react";
import axios from "axios";
import { store } from "../../globalData/store";
import { UserInterface } from "../../interfaces/UserInterface";
import CustomNavbar from "../Navbar/Navbar";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";

export const UserProfile: React.FC = () => {
    const [user, setUser] = useState<UserInterface>(store.loggedInUser);
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/users/${user.userId}`, { withCredentials: true });
                setUser(response.data);
                setUsername(response.data.username);
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to fetch user data.");
            }
        };

        fetchUserData();
    }, [user.userId]);

    const handleUpdate = async () => {
        if (!username.trim()) {
            toast.error("Username cannot be left blank.");
            return;
        }

        if (username === user.username) {
            toast.error("New username cannot be the same as the current username.");
            return;
        }

        if (password.trim().length === 0) {
            toast.error("Password cannot be left empty.");
            return;
        }

        try {
            // Check if the new username is already taken
            const usernameCheckResponse = await axios.get(`http://localhost:8080/users/exists/${username}`, { withCredentials: true });
            if (usernameCheckResponse.data.exists) {
                toast.error("Username already exists. Please choose another username.");
                return;
            }

            // Update user information
            await axios.patch(`http://localhost:8080/users/update/${user.userId}`, {
                username: username,
                password: password
            }, { withCredentials: true });

            // Fetch updated user data
            const updatedUserResponse = await axios.get(`http://localhost:8080/users/${user.userId}`, { withCredentials: true });
            setUser(updatedUserResponse.data);

            setIsEditing(false);
            toast.success("User data updated successfully!");
        } catch (error) {
            console.error("Error updating user data:", error);
            toast.error("Username already exists. Please choose another username."); //will fix later
        }
    };

    return (
        <div>
            <CustomNavbar />
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col md={6} className="mb-4">
                        <div className="text-center mb-4">
                            <h1><strong>{user.firstName} {user.lastName}</strong></h1>
                            <Image
                                src="https://img.icons8.com/?size=100&id=uLFwQfRJmJTu&format=png&color=000000"
                                img-fluid
                                width={200}
                                height={200}
                                roundedCircle
                                className="mb-3"
                            />
                        </div>
                        <div className="text-center mb-4">
                            <p><strong>User ID:</strong> {user.userId || "N/A"}</p>
                            <p><strong>Username:</strong> {user.username || "N/A"}</p>
                            <p><strong>Role:</strong> {user.role || "N/A"}</p>
                        </div>
                        {isEditing ? (
                            <div className="p-3 rounded shadow-sm bg-dark-subtle">
                                <Form.Group controlId="username" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Button onClick={handleUpdate} variant="primary" className="me-2">Save Changes</Button>
                                <Button onClick={() => setIsEditing(false)} variant="secondary">Cancel</Button>
                            </div>
                        ) : (
                            <Button onClick={() => setIsEditing(true)} variant="primary">Update Username or Password</Button>
                        )}
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </div>
    );
};
