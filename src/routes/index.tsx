
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { businessRoutes, bookingRoutes } from './businessRoutes';
import { publicRoutes } from './publicRoutes';
import { superadminRoutes } from './superadminRoutes';

export const AppRoutes = () => {
  const elements = useRoutes([
    ...authRoutes,
    ...businessRoutes,
    ...bookingRoutes,
    ...publicRoutes,
    ...superadminRoutes
  ]);
  
  return elements;
};

// Export as default for backward compatibility
export default AppRoutes;
