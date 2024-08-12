import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { store } from "../../globalData/store";
import { useDarkMode } from '../../contexts/DarkmodeContext';
import './CustomNavbar.css';

const CustomNavbar: React.FC = () => {
    const navigate = useNavigate();
    const user = store.loggedInUser;
    const { isDarkMode } = useDarkMode();

    console.log("User data in Navbar:", user);

    // Update localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(store.loggedInUser));

    // Retrieve from localStorage
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
        store.loggedInUser = JSON.parse(savedUser);
    }

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
            <Navbar.Brand onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
                <img
                    src="https://img.icons8.com/?size=100&id=46777&format=png&color=000000"
                    alt="Logo"
                    width="30"
                    height="30"
                />
                {user.userId ? ` | ${user.firstName} ${user.lastName}  |` : ` | Dashboard |`}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {/* Left-aligned items */}
                    {user.userId && (
                        <Nav.Link as={Link} to="/user-profile" className={`text-${isDarkMode ? 'primary' : 'dark'}`}>
                            | User Profile |
                        </Nav.Link>
                    )}
                </Nav>
                <Nav className="ml-auto d-flex align-items-center">
                    {/* Right-aligned items */}
                    {user.userId ? (
                        <Nav.Link onClick={handleLogout} className={`text-${isDarkMode ? 'primary' : 'dark'}`}>
                            | Logout |
                        </Nav.Link>
                    ) : (
                        <Nav.Link as={Link} to="/" className={`text-${isDarkMode ? 'primary' : 'dark'}`}>
                            | Login |
                        </Nav.Link>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default CustomNavbar;
