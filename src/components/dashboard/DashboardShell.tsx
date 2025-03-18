
import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-primary text-primary-foreground p-4">
      <h1 className="text-xl font-bold">WAKTI Dashboard</h1>
    </header>
    <main className="flex-1 p-4">
      <Outlet />
      {children}
    </main>
  </div>
);

export default DashboardShell;

