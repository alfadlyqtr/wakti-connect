
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

const DashboardShell = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

export default DashboardShell;
