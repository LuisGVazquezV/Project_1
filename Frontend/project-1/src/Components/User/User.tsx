import { useEffect, useState } from "react";
import { UserInterface } from "../../interfaces/UserInterface";
import { Button, Table } from "react-bootstrap";
import axios from "axios";

export const User: React.FC<{ users: UserInterface[] }> = ({ users }) => {

    useEffect(() => {
        console.log(users);
    }, [users]);

    const [selectedUser, setSelectedUser] = useState<UserInterface>({
        userId: 0,
        firstName: "",
        lastName: "",
        username: "default_user",
        password: "",
        role: ""
    });

    const [newRole, setNewRole] = useState<string>("");
    const [userOptions, setUserOptions] = useState<boolean>(false);

    const selectUserData = (user: UserInterface) => {
        setSelectedUser(user);
        setUserOptions(true);
    };

    const deleteUser = async () => {
        try {
            const response = await axios.delete("http://localhost:8080/users/" + selectedUser.userId);
            console.log(response.data);
            setUserOptions(false);
            // Optionally, refresh the users list after deletion
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const updateRole = async () => {
        if (newRole) {
            try {
                const response = await axios.patch(
                    "http://localhost:8080/users/" + selectedUser.userId + "/role",
                    newRole,
                    { headers: { "Content-Type": "text/plain" } }
                );
                console.log(response.data);
                setUserOptions(false);

            } catch (error) {
                console.error("Error updating role:", error);
            }
        }
    };

    return (
        <div className="container">
            <h3>Welcome Manager! All Users: </h3>
            {userOptions ?
                <div className="m-5 w-50 d-flex flex-column">
                    <input
                        className="m-2"
                        type="text"
                        placeholder="New Role"
                        value={newRole}
                        onChange={(input) => setNewRole(input.target.value)}
                    />
                    <div className="d-flex flex-row">
                        <button className="m-2" onClick={updateRole}>Update Role</button>
                        <button className="m-2" onClick={deleteUser}>Delete User</button>
                        <button className="m-2" onClick={() => setUserOptions(false)}>Cancel</button>
                    </div>
                </div>
                : null
            }
            <Table striped bordered hover variant="primary">
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.userId} onClick={() => selectUserData(user)}>
                        <td>{user.userId}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td><Button variant="outline-danger">Delete Employee</Button></td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};
