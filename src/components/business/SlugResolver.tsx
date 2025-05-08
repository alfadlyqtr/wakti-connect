
import React from "react";
import { Navigate } from "react-router-dom";

// Simply redirect to the homepage - no more slug resolving
const SlugResolver = () => <Navigate to="/" replace />;

export default SlugResolver;
