
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UseStaffSyncProps {
  onSuccess?: () => void;
}

export const useStaffSync = ({ onSuccess }: UseStaffSyncProps = {}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const syncStaffRecords = async () => {
    setIsSyncing(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/sync-staff-records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionData.session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync staff records');
      }

      const result = await response.json();
      
      toast({
        title: "Staff Synchronized",
        description: `Successfully synchronized ${result.data?.synced?.length || 0} staff records.`
      });
      
      // Refresh staff list
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync staff records",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    syncStaffRecords
  };
};
