import {useNavigate} from "react-router-dom"

export const UsersContainer: React.FC<any> = ({users:any}) => {

    const navigate = useNavigate()

    return(
        <div>
            <button onClick={()=>navigate("/reimbursements")}>See Your Reimbursements</button>
            <h3>Welcome Manager! Here's where I would ut my Employees</h3>
            <h4>(IF I HAD ANY</h4>
        </div>
    )
}