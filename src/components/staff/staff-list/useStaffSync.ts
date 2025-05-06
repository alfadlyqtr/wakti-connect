
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
      // Call the Supabase Edge Function directly instead of using fetch
      const { data, error } = await supabase.functions.invoke('sync-staff-records', {
        method: 'POST',
      });

      if (error) {
        throw new Error(error.message || 'Failed to sync staff records');
      }

      toast({
        title: "Staff Synchronized",
        description: `Successfully synchronized ${data?.synced?.length || 0} staff records.`
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
      console.error("Staff sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    syncStaffRecords
  };
};
