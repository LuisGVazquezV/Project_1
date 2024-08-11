import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { store } from "../../globalData/store";

export const Logout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true });

            // Clear user data from store and localStorage
            store.loggedInUser = {
                userId: 0,
                firstName: "",
                lastName: "",
                username: "",
                password: "",
                role: ""
            };
            localStorage.removeItem('loggedInUser');

            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
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
