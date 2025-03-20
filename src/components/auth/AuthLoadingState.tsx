
import React from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AuthLoadingStateProps {
  authError: string | null;
}

const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({ authError }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner color="border-wakti-blue" />
        <p className="mt-4 text-gray-600">Initializing application...</p>
        {authError && (
          <p className="mt-2 text-red-500 text-sm">{authError}</p>
        )}
      </div>
    </div>
  );
};

export default AuthLoadingState;
