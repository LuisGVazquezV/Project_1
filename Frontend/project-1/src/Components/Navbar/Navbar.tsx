import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { store } from "../../globalData/store";

const CustomNavbar: React.FC = () => {
    const navigate = useNavigate();
    const user = store.loggedInUser;

    const handleLogout = async () => {
        try {
            // Call the logout endpoint
            await axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true });

            // Clear user state and local storage
            store.loggedInUser = {
                userId: 0,
                firstName: "",
                lastName: "",
                username: "",
                password: "",
                role: ""
            };
            localStorage.removeItem('loggedInUser');

            // Navigate to the login page
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const handleHomeClick = () => {
        if (user.role === "Employee") {
            navigate("/employee-dashboard");
        } else if (user.role === "Manager") {
            navigate("/manager-dashboard");
        } else {
            navigate("/");
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand onClick={handleHomeClick} style={{ cursor: 'pointer' }}>Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {user.userId && (
                        <>
                            <Nav.Link as={Link} to="/user-profile">Profile</Nav.Link>
                            <Nav.Link as={Link} to="/add-reimbursement">Add Reimbursement</Nav.Link>
                        </>
                    )}
                </Nav>
                <Nav className="ml-auto d-flex align-items-center">
                    {user.userId && (
                        <>
                            <span className="text-light mr-3">{user.firstName} {user.lastName}</span>
                            <Nav.Link onClick={handleLogout} className="text-light">Logout</Nav.Link>
                        </>
                    )}
                    {!user.userId && (
                        <Nav.Link as={Link} to="/">Login</Nav.Link>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default CustomNavbar;
