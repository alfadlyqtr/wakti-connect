
import React from "react";
import { Navigate } from "react-router-dom";

// Redirect to dashboard instead of showing business page
const DashboardBusinessPage = () => <Navigate to="/dashboard" replace />;

export default DashboardBusinessPage;
