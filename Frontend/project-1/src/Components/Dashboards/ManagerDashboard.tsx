import React, { useState } from "react";

import { Button, Container } from "react-bootstrap";
import CustomNavbar from "../Navbar/Navbar";
import {ReimbursementContainer} from "../Reimbursement/ReimbursementContainer";
import {UsersContainer} from "../User/UsersContainer";
import "../../App.css";


function UserContainer() {
    return null;
}

export const ManagerDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("reimbursements");

    return (
        <div>
            <CustomNavbar />
            <Container className="mt-4">
                <h1 className= "dashboard-header">Manager Dashboard</h1>
                <Button
                    variant="outline-primary"
                    onClick={() => setActiveTab("reimbursements")}
                >
                    Reimbursements
                </Button>
                <Button
                    variant="outline-primary"
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
