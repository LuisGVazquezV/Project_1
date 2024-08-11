import React, { useEffect, useState } from "react";
import axios from "axios";
import { store } from "../../globalData/store";
import { UserInterface } from "../../interfaces/UserInterface";
import "../../App.css";
import CustomNavbar from "../Navbar/Navbar";

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
            }
        };

        fetchUserData();
    }, [user.userId]);

    const handleUpdate = async () => {
        try {
            await axios.patch(`http://localhost:8080/users/${user.userId}`, {
                username: username,
                password: password
            }, { withCredentials: true });

            setUser(prevUser => ({
                ...prevUser,
                username: username,
                password: password
            }));
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };

    return (
        <div><CustomNavbar />
        <div className="container mt-4">

            <h1>User Profile</h1>
            <div>
                <p><strong>First Name:</strong> {user.firstName || "N/A"}</p>
                <p><strong>Last Name:</strong> {user.lastName || "N/A"}</p>
                <p><strong>Username:</strong> {user.username || "N/A"}</p>
                <p><strong>Role:</strong> {user.role || "N/A"}</p>
            </div>
            {isEditing ? (
                <div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <button onClick={handleUpdate} className="btn btn-primary mt-2">Save Changes</button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary mt-2">Cancel</button>
                </div>
            ) : (
                <button onClick={() => setIsEditing(true)} className="btn btn-primary mt-2">Update Username or Password</button>
            )}
        </div></div>
    );
};
