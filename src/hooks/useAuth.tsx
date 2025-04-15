
import React from 'react';
import { AuthContextType } from '@/hooks/auth/types';
import { useAuth as useAuthFromContext } from '@/hooks/auth';

// Re-export the useAuth hook from auth/index.ts
export const useAuth = useAuthFromContext;
