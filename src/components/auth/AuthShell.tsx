
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-muted/20">
    <div className="w-full max-w-md p-6 bg-card shadow-lg rounded-lg">
      <Outlet />
      {children}
    </div>
  </div>
);

export default AuthShell;

