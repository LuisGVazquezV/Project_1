import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Register: React.FC = () => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        role: "Employee"
    });

    const navigate = useNavigate();

    const storeValues = (input: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = input.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const register = async () => {
        const { username, password, firstName, lastName } = user;
        if (!username || !password || !firstName || !lastName) {
            toast.error("Please fill out all fields");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/users/register", user);
            console.log(response.data);

            setTimeout(() => {
                toast.success(`${response.data.username} was created! Go back to Log in!`);
            });

            /*const { role } = response.data;
            if (role === "Employee") {
                navigate("/");
            } else if (role === "Manager") {
                navigate("/");
            } else {
                navigate("/");
            }*/
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Register failed! Error message: " + error.message);
            } else {
                toast.error("Register failed! An unknown error occurred.");
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">Register For A New Account!</h3>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="First Name"
                        name="firstName"
                        onChange={storeValues}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        name="lastName"
                        onChange={storeValues}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        name="username"
                        onChange={storeValues}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        className="form-control"
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
