import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { store } from "../../globalData/store";

const CustomNavbar: React.FC = () => {
    const navigate = useNavigate();
    const isLoggedIn = store.loggedInUser !== null;

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });
            store.loggedInUser = null;
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed! Please try again.");
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand as={Link} to="/">Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {isLoggedIn && (
                        <>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                            <Nav.Link as={Link} to="/dashboard">Home</Nav.Link>
                        </>
                    )}
                </Nav>
                {isLoggedIn ? (
                    <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                ) : (
                    <Nav.Link as={Link} to="/">Login</Nav.Link>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default CustomNavbar;
