import { Role } from "./role"

export interface User {
    id:number,
    name:string,
    email:string,
    password:string,
    dob:string,
    city:string,
    verified:boolean,
    emailVerified:boolean,
    phone:string,
    avatar:string,
    userDetail:string,
    role:Role
}
