
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Create an in-memory cache for permissions
const permissionsCache = new Map<string, boolean>();
const cacheTTL = 5 * 60 * 1000; // 5 minutes
const cacheTimestamps = new Map<string, number>();

export const usePermissions = (feature: string) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkPermission = useCallback(async () => {
    try {
      // Check cache first
      const now = Date.now();
      const cachedTimestamp = cacheTimestamps.get(feature);
      const cachedValue = permissionsCache.get(feature);

      if (cachedValue !== undefined && cachedTimestamp && now - cachedTimestamp < cacheTTL) {
        setHasPermission(cachedValue);
        setIsLoading(false);
        return;
      }

      const { data, error: rpcError } = await supabase.rpc('can_use_feature', {
        feature_name: feature
      });

      if (rpcError) throw rpcError;

      // Update cache
      permissionsCache.set(feature, data);
      cacheTimestamps.set(feature, now);
      
      setHasPermission(data);
      setError(null);
    } catch (err) {
      console.error('Error checking permission:', err);
      setError(err as Error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, [feature]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      checkPermission();
    } else if (!isAuthenticated && !authLoading) {
      setHasPermission(false);
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading, checkPermission]);

  return {
    hasPermission,
    isLoading,
    error,
    checkPermission // Exposed to allow manual refresh
  };
};
