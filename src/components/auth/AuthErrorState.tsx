
import React from 'react';

interface AuthErrorStateProps {
  authError: string;
}

const AuthErrorState: React.FC<AuthErrorStateProps> = ({ authError }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
        <p className="text-gray-700 mb-4">{authError}</p>
        <p className="text-gray-600 mb-6">We're having trouble connecting to our authentication services. This might be a temporary issue.</p>
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Reload Page
          </button>
          <button 
            onClick={() => window.location.href = '/auth/login'} 
            className="w-full py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorState;
