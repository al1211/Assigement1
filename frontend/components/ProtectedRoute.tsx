import React from "react";
import {Navigate} from "react-router-dom"
import { getToken } from "../utils/auth"


const protectedRoute=({children}:any)=>{
    const token=getToken();
    if(!token){
        return <Navigate to="signup"/>
    }
    return children;
}

export default protectedRoute;