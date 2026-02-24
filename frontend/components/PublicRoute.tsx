// components/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";

const PublicRoute = ({ children }:any) => {
  const token = getToken();

  if (token) {
    return <Navigate to="/admin/product/list" replace />;
  }

  return children;
};

export default PublicRoute;