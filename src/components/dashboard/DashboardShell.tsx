
import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardShell = () => (
  <div className="min-h-screen flex flex-col">
    <main className="flex-1 p-4">
      <Outlet />
    </main>
  </div>
);

export default DashboardShell;
