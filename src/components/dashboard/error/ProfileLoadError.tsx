
import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileLoadError = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Unable to load profile</h2>
      <p className="text-muted-foreground mb-6">There was a problem loading your profile information.</p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/auth/login")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Go to Login
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ProfileLoadError;
