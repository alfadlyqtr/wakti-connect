
import React from 'react';
import { RouteObject } from 'react-router-dom';
import SuperAdminDashboard from '@/components/superadmin/dashboard/SuperAdminDashboard';
import UsersPage from '@/components/superadmin/users/UsersPage';

// Changed the type to RouteObject to match what router.tsx expects
export const superadminRoutes: RouteObject[] = [
  {
    path: '',
    element: <SuperAdminDashboard />,
    index: true
  },
  {
    path: 'users',
    element: <UsersPage />
  },
  // Placeholder routes that we'll implement later
  {
    path: 'businesses',
    element: <div className="p-8 text-center text-white">Businesses Management Page - Coming Soon</div>
  },
  {
    path: 'security',
    element: <div className="p-8 text-center text-white">Security Center - Coming Soon</div>
  },
  {
    path: 'financial',
    element: <div className="p-8 text-center text-white">Financial Controls - Coming Soon</div>
  },
  {
    path: 'content',
    element: <div className="p-8 text-center text-white">Content Management - Coming Soon</div>
  },
  {
    path: 'system',
    element: <div className="p-8 text-center text-white">System Configuration - Coming Soon</div>
  },
  {
    path: 'analytics',
    element: <div className="p-8 text-center text-white">Advanced Analytics - Coming Soon</div>
  },
  {
    path: 'architecture',
    element: <div className="p-8 text-center text-white">System Architecture Controls - Coming Soon</div>
  },
  {
    path: 'experiments',
    element: <div className="p-8 text-center text-white">Experiments & Beta Features - Coming Soon</div>
  },
  {
    path: 'compliance',
    element: <div className="p-8 text-center text-white">Compliance Management - Coming Soon</div>
  },
  {
    path: 'ai-control',
    element: <div className="p-8 text-center text-white">AI Control Panel - Coming Soon</div>
  },
  {
    path: 'inbox',
    element: <div className="p-8 text-center text-white">Admin Inbox - Coming Soon</div>
  },
  {
    path: 'developer',
    element: <div className="p-8 text-center text-white">Developer Tools - Coming Soon</div>
  },
  {
    path: 'emergency',
    element: <div className="p-8 text-center text-white">Emergency Controls - Coming Soon</div>
  }
];
