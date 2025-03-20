
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthShell = () => (
  <div className="min-h-screen flex items-center justify-center bg-muted/20">
    <div className="w-full max-w-md p-6 bg-card shadow-lg rounded-lg">
      <Outlet />
    </div>
  </div>
);

export default AuthShell;
