import { UserInterface } from "../interfaces/UserInterface";

// Load user data from local storage or initialize with default values
const storedUser = localStorage.getItem('loggedInUser');
const initialUser: UserInterface = storedUser ? JSON.parse(storedUser) : {
    userId: 0,
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    role: ""
};

export const store: any = {
    loggedInUser: initialUser,
    baseUrl: "http://localhost:8080/"
};