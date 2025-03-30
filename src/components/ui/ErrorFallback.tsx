
import React from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-700 mb-4">The application encountered an error:</p>
        <pre className="bg-gray-100 p-3 rounded-md overflow-auto max-h-40 mb-4 text-sm">
          {error.message}
        </pre>
        <div className="flex flex-col space-y-3">
          <button 
            onClick={resetErrorBoundary} 
            className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
