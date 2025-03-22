
import React from 'react';
// This file is now a re-export from the auth folder
// to maintain backward compatibility with existing imports
// Force a new re-export to update TypeScript's understanding of the types
export { useAuth, AuthProvider } from './auth';
export type { User, AuthContextType } from './auth/types';
