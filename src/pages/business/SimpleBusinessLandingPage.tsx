
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';

const SimpleBusinessLandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Redirect to homepage after a short delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold mb-4">Business Pages Have Been Removed</h1>
        <p className="text-gray-600">This feature is no longer available.</p>
        <p className="text-gray-500 mt-2">Redirecting to homepage...</p>
      </div>
    </PublicLayout>
  );
};

export default SimpleBusinessLandingPage;
