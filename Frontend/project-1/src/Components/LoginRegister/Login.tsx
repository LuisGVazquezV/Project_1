import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { store } from "../../globalData/store";

export const Login: React.FC = () => {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    const storeValues = (input: any) => {
        if (input.target.name === "username") {
            setUser((user) => ({ ...user, username: input.target.value }));
        } else {
            setUser((user) => ({ ...user, password: input.target.value }));
        }
    };

    const login = async () => {
        try {
            const response = await axios.post("http://localhost:8080/auth", user, { withCredentials: true });
            const userData = response.data;

            // Ensure that store.loggedInUser contains necessary user details
            store.loggedInUser = {
                userId: userData.userId,
                username: userData.username,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role
            };

            // Persist user details in localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(store.loggedInUser));

            // Display a welcome message with username (optional)
            alert(`Welcome, ${store.loggedInUser.username}`);

            // Navigate based on the user's role
            if (userData.role === "Employee") {
                navigate("/employee-dashboard");
            } else if (userData.role === "Manager") {
                navigate("/manager-dashboard");
            } else {
                // Handle other roles or default navigation
                navigate("/");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed! Please try again.");
        }
    };


    return (
        <div className="login">
            <div className="text-container">
                <h1>Welcome to the Car Exchange</h1>
                <h3>Log in to Create and View Cars!</h3>

                <div className="input-container">
                    <input type="text" placeholder="username" name="username" onChange={storeValues} />
                </div>

                <div className="input-container">
                    <input type="password" placeholder="password" name="password" onChange={storeValues} />
                </div>

                <button className="login-button" onClick={login}>Login</button>
                <button className="login-button" onClick={() => navigate("/register")}>Create Account</button>
            </div>
        </div>
    );
};
