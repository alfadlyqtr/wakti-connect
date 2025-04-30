
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This is a placeholder component to handle redirects from the removed events page
const DashboardEvents = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard home
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-64">
      <p className="text-muted-foreground">Redirecting to dashboard...</p>
    </div>
  );
};

export default DashboardEvents;
