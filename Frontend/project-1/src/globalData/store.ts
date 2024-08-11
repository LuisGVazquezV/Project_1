import {UserInterface} from "../interfaces/UserInterface"

export const store:any ={
    loggedInUser:{
        userId:0,
        firstName:"",
        lastName:"",
        username:"",
        password:"",
        role:""
    } as UserInterface,

    baseUrl:"http://localhost:8080/"
}