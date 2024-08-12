import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Form, Modal } from "react-bootstrap";
import { useDarkMode } from "../../contexts/DarkmodeContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


interface FormValues {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export const UsersContainer: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [formValues, setFormValues] = useState<FormValues>({
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    });
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/users", { withCredentials: true });
                setUsers(response.data);
            } catch (error) {
                toast.error("Failed to fetch users.");
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
            const updatedRole = response.data;
            setUsers(users.map(user =>
                user.userId === userId ? { ...user, role: updatedRole } : user
            ));
            toast.success(`User role updated to ${newRole}!`);
        } catch (error) {
            toast.error("Error updating user role.");
        }
    };

    const handleUserDelete = async (userId: number) => {
        try {
            await axios.delete(`http://localhost:8080/users/${userId}`, {
                withCredentials: true
            });
            setUsers(users.filter(user => user.userId !== userId));
            toast.success("User deleted successfully!");
        } catch (error) {
            toast.error("Error deleting user.");
        }
    };

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setFormValues({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            password: ''
        });
        setShowEditModal(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateUser = async () => {
        try {
            await axios.patch(`http://localhost:8080/users/update/${selectedUser.userId}`, formValues, {
                withCredentials: true
            });
            setUsers(users.map(user =>
                user.userId === selectedUser.userId ? { ...user, ...formValues } : user
            ));
            setShowEditModal(false);
            toast.success("User updated successfully!");
        } catch (error) {
            toast.error("Error updating user.");
        }
    };

    return (
        <div>
            <ToastContainer />
            <div className="heading-section">
                <h2>All Users</h2>
            </div>
            <Table striped bordered hover variant={isDarkMode ? "dark" : "primary"} className="mt-4">
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
                                onClick={() => handleEditClick(user)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outline-info"
                                onClick={() => handleUserRoleUpdate(user.userId, user.role)}
                                className="ms-2"
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


            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formValues.firstName || ''}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName" className="mt-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={formValues.lastName || ''}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formUsername" className="mt-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formValues.username || ''}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formValues.password || ''}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            className="mt-3"
                            onClick={handleUpdateUser}
                        >
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};
