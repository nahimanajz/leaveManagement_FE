import React from "react";
import { Navigate } from "react-router-dom";
import { getUserSession } from "@/utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[]; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const user = getUserSession();

  if (!user) {
    return <Navigate to="/" replace />;
  }
   
  if (!requiredRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;