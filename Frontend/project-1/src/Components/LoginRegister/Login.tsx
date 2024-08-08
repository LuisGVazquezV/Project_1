export{}
/*import {useState} from "react"
import axios from "axios"
import {store} from "../../globalData/store"
import { useNavigate } from "react-router-dom"
import { setSourceMapRange } from "typescript"

export const Login: React.FC = () => {
    const[user, setUser] = useState({
    username:"",
    password:""
})

const navigate = useNavigate()

const storeValues = (input:any) => {
    if(input.target.name === "username"){
        setUser((user) => ({...user, username:input.target.value}))
    }else{
        setUser((user) => ({...user, password:input.target.value}))
    }
}

const login = async () => {
    const response = await axios.post("http://localhost/auth", user, {withCredentials:true})
    .then(
        (response) => {
            console.log(response.data)

            store.loggedInUser = response.data
             
            alert("Welcome! " + store.loggedInUser.username)

            if(response.data.role == "Employee"){
                navigate("/reimbursements")
            }
            if(response.data.role == "Manager"){
                navigate("/users")
            }
        }
    )
    .catch(
        (error) => {
        console.error(error);
        alert("Login Failed! Try Again!")
        }
    )
}


    return (
        <div className = "login">
            <div className = "text-container">
                <h1>Welcome to the Employee Reimbursement System </h1>
                <h3>Log in to Create and View Reimbursements!</h3>

                <div className="input-container">
                    <input type="text" placeholder="username" name="username" onChange={storeValues}/>
                </div>

                <div className="input-container">
                    <input type="password" placeholder="password" name="password" onChange={storeValues}/>
                </div>

                <button className="login-button" onClick={login}>Login</button>
                <button className="login-button" onClick={() => navigate("/register")}>Create Account</button>

            </div>
        </div>
    )
}*/