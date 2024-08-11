import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register: React.FC = () => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        role: "Employee" // default role
    });

    const navigate = useNavigate();

    const storeValues = (input: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = input.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const register = async () => {
        const { username, password, firstName, lastName } = user;
        if (!username || !password || !firstName || !lastName) {
            alert("Please fill out all fields");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/users/register", user);
            console.log(response.data);
            alert(response.data.username + " was created!");

            // Navigate based on the user's role or any other logic
            if (response.data.role === "Employee") {
                navigate("/reimbursements");
            } else if (response.data.role === "Manager") {
                navigate("/users");
            } else {
                navigate("/");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert("Register failed! Error message: " + error.message);
            } else {
                alert("Register failed! An unknown error occurred.");
            }
        }
    };

    return (
        <div>
            <div className="text-container">
                <h3>Register for a new account here!</h3>
                <div className="input-container">
                    <input type="text" placeholder="First Name" name="firstName" onChange={storeValues} />
                </div>
                <div className="input-container">
                    <input type="text" placeholder="Last Name" name="lastName" onChange={storeValues} />
                </div>
                <div className="input-container">
                    <input type="text" placeholder="username" name="username" onChange={storeValues} />
                </div>
                <div className="input-container">
                    <input type="password" placeholder="password" name="password" onChange={storeValues} />
                </div>
                <button className="login-button" onClick={register}>Submit</button>
                <button className="login-button" onClick={() => navigate("/")}>Back</button>
            </div>
        </div>
    );
};
