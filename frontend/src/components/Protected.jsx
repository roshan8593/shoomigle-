import React from "react";
import { Navigate } from "react-router";
function ProtectedRoute({children}){
   let isAllowed = localStorage.getItem("token");
    return isAllowed ? children : <Navigate to="*" />;
    
}
export default ProtectedRoute;

