
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { businessRoutes, bookingRoutes } from './businessRoutes';
import { publicRoutes } from './publicRoutes';
import { superadminRoutes } from './superadminRoutes';

// Combine all routes into a single component
const AppRoutes = () => {
  const elements = useRoutes([
    ...authRoutes,
    ...businessRoutes,
    ...bookingRoutes,
    ...publicRoutes,
    ...superadminRoutes
  ]);
  
  return elements;
};

export default AppRoutes;
