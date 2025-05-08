
import React from "react";
import { Navigate } from "react-router-dom";

// Redirect to the main not found page
const BusinessPageNotFound = () => <Navigate to="/404" replace />;

export default BusinessPageNotFound;
