
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AuthLoadingStateProps {
  authError: string | null;
}

const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({ authError }) => {
  const [extendedLoading, setExtendedLoading] = useState(false);
  
  useEffect(() => {
    console.log("AuthLoadingState mounted", { authError });
    
    const timeout = setTimeout(() => {
      console.log("Extended loading timeout reached");
      setExtendedLoading(true);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [authError]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="mt-4 text-gray-600">
          {extendedLoading
            ? "Still working on connecting to services..."
            : "Initializing application..."}
        </p>
        {extendedLoading && !authError && (
          <p className="mt-2 text-sm text-gray-500">
            This is taking longer than expected. Please wait a moment.
          </p>
        )}
        {authError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 font-medium">Connection Error</p>
            <p className="text-sm text-red-500 mt-1">{authError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-primary text-white text-sm rounded-md"
            >
              Reload Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLoadingState;
