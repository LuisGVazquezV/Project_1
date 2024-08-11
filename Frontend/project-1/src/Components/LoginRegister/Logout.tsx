import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { store } from "../../globalData/store";

export const Logout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Send request to backend to logout user
            await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });

            // Clear user data from global state
            store.loggedInUser = null;

            // Redirect to login page
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed! Please try again.");
        }
    };

    // Call handleLogout when the component mounts
    useEffect(() => {
        handleLogout();
    }, []);

    return (
        <div>
            <h3>Logging out...</h3>
        </div>
    );
};
