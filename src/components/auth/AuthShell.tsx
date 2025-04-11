
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthShell = ({ children }: { children: React.ReactNode }) => {
  console.log("AuthShell rendering with Outlet");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="w-full max-w-md p-6">
        <Outlet />
        {children}
      </div>
    </div>
  );
};

export default AuthShell;
