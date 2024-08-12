import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import CustomNavbar from "../Navbar/Navbar";
import { ReimbursementContainer } from "../Reimbursement/ReimbursementContainer";
import { UsersContainer } from "../User/UsersContainer";
import "../../App.css";
import { store } from "../../globalData/store";

export const ManagerDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("reimbursements");
    const user = store.loggedInUser;



    return (
        <div>
            <CustomNavbar />
            <Container className="mt-4">
                <div className="d-flex align-items-center">
                    <h1 className="dashboard-header">Manager Dashboard</h1>
                </div>
                <Button
                    variant="outline-primary btn-lg"
                    onClick={() => setActiveTab("reimbursements")}
                >
                    Reimbursements
                </Button>
                <Button
                    variant="outline-primary btn-lg"
                    className="ms-2"
                    onClick={() => setActiveTab("users")}
                >
                    Users
                </Button>

                {activeTab === "reimbursements" && <ReimbursementContainer />}
                {activeTab === "users" && <UsersContainer />}
            </Container>
        </div>
    );
};
