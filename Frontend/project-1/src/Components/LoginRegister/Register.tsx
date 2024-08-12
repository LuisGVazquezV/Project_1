import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDarkMode } from "../../contexts/DarkmodeContext";
import "../LoginRegister/Register.css";

export const Register: React.FC = () => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        role: "Employee"
    });

    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode(); // Access dark mode state

    const storeValues = (input: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = input.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const validateForm = () => {
        const { username, password, firstName, lastName } = user;
        const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/; // Alphanumeric usernames that start with a letter

        if (!firstName.trim() || !lastName.trim() || !username.trim() || !password.trim()) {
            toast.error("First Name, Last Name, Username, and Password are required.");
            return false;
        }

        if (username.length < 5) {
            toast.error("Username must be at least 5 characters long.");
            return false;
        }

        if (!usernameRegex.test(username)) {
            toast.error("Username must start with a letter and contain only letters and numbers.");
            return false;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return false;
        }

        return true;
    };

    const register = async () => {
        if (!validateForm()) return; // Exit if form validation fails

        try {
            const response = await axios.post("http://localhost:8080/users/register", user);
            console.log(response.data);

            toast.success(`${response.data.username} was created! Go back to Log in!`);
            setTimeout(() => {
                navigate("/"); // Redirect to login or home page
            }, 2000); // Optional delay before redirect
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 500) {
                    toast.error("Username already exists. Please choose another username.");
                } else {
                    toast.error("Register failed! Error message: " + error.message);
                }
            } else if (error instanceof Error) {
                toast.error("Register failed! Error message: " + error.message);
            } else {
                toast.error("Register failed! An unknown error occurred.");
            }
        }
    };

    return (
        <div className={`d-flex justify-content-center align-items-center vh-100 ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className={`card p-4 ${isDarkMode ? 'card-dark' : 'card-light'}`} style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">Register For A New Account!</h3>
                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control ${isDarkMode ? 'input-dark' : 'input-light'}`}
                        placeholder="First Name"
                        name="firstName"
                        onChange={storeValues}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control ${isDarkMode ? 'input-dark' : 'input-light'}`}
                        placeholder="Last Name"
                        name="lastName"
                        onChange={storeValues}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control ${isDarkMode ? 'input-dark' : 'input-light'}`}
                        placeholder="Username"
                        name="username"
                        onChange={storeValues}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        className={`form-control ${isDarkMode ? 'input-dark' : 'input-light'}`}
                        placeholder="Password"
                        name="password"
                        onChange={storeValues}
                    />
                </div>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-primary" onClick={register}>Submit</button>
                    <button className="btn btn-secondary" onClick={() => navigate("/")}>Back</button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};
