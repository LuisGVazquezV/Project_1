import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { store } from "../../globalData/store";
import { useDarkMode } from '../../contexts/DarkmodeContext';
import './CustomNavbar.css'; // Ensure this path is correct

const CustomNavbar: React.FC = () => {
    const navigate = useNavigate();
    const user = store.loggedInUser;
    const { isDarkMode } = useDarkMode();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true });
            store.loggedInUser = {
                userId: 0,
                firstName: "",
                lastName: "",
                username: "",
                password: "",
                role: ""
            };
            localStorage.removeItem('loggedInUser');
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
        <Navbar className={`navbar-custom ${isDarkMode ? 'navbar-dark-mode' : 'navbar-light-mode'}`} expand="lg">
            <Navbar.Brand onClick={handleHomeClick} style={{ cursor: 'pointer' }}>| Dashboard |</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {user.userId && (
                        <>
                            <Nav.Link as={Link} to="/user-profile">| User Profile |</Nav.Link>
                            <Nav.Link as={Link} to="/add-reimbursement">| Add Reimbursement |</Nav.Link>
                        </>
                    )}
                </Nav>
                <Nav className="ml-auto d-flex align-items-center">
                    {user.userId && (
                        <>
                            <span className={`text-${isDarkMode ? 'light' : 'dark'} mr-3`}>
                                {user.firstName} {user.lastName}
                            </span>
                            <Nav.Link onClick={handleLogout} className={`text-${isDarkMode ? 'light' : 'dark'}`}>| Logout |</Nav.Link>
                        </>
                    )}
                    {!user.userId && (
                        <Nav.Link as={Link} to="/" className={`text-${isDarkMode ? 'light' : 'dark'}`}>| Login |</Nav.Link>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default CustomNavbar;
