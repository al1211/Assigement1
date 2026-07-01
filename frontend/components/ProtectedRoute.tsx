import React from "react";
import {Navigate} from "react-router-dom"



const protectedRoute=({children}:any)=>{
    const token=localStorage.getItem("token")
    if(!token){
        return <Navigate to="signup"/>
    }
    return children;
}

export default protectedRoute;