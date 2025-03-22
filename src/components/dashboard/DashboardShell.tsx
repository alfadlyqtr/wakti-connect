
import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardShell = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="min-h-screen flex flex-col">
    <main className="flex-1 p-4">
      <Outlet />
      {children}
    </main>
  </div>
);

export default DashboardShell;
