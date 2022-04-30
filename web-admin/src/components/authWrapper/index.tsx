import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthWrapper() {
  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
