import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";

export const UsersContainer: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/users", { withCredentials: true });
                setUsers(response.data);
            } catch (error) {
                alert("Failed to fetch users.");
            }
        };

        fetchUsers();
    }, []);

    const handleUserRoleUpdate = async (userId: number, currentRole: any) => {
        const roleString = typeof currentRole === 'object' ? currentRole.role : currentRole;
        const promoteRole = "Manager";
        const demoteRole = "Employee";
        const newRole = roleString === demoteRole ? promoteRole : demoteRole;

        try {
            const response = await axios.patch(`http://localhost:8080/users/${userId}`, { role: newRole }, {
                withCredentials: true
            });
            const updatedRole = response.data; // This should be just "Manager" or "Employee"
            setUsers(users.map(user =>
                user.userId === userId ? { ...user, role: updatedRole } : user
            ));
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    };


    const handleUserDelete = async (userId: number) => {
        try {
            await axios.delete(`http://localhost:8080/users/${userId}`, {
                withCredentials: true
            });
            setUsers(users.filter(user => user.userId !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div>
            <h2>All Users</h2>
            <Table striped bordered hover variant="primary" className="mt-4">
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>
                            <Button
                                variant="outline-info"
                                onClick={() => handleUserRoleUpdate(user.userId, user.role)}
                            >
                                {user.role === "Employee" ? "Promote to Manager" : "Demote to Employee"}
                            </Button>
                            <Button
                                variant="outline-warning"
                                className="ms-2"
                                onClick={() => handleUserDelete(user.userId)}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};
