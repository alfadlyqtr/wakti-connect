
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UseStaffSyncOptions {
  onSuccess?: () => void;
}

export const useStaffSync = ({ onSuccess }: UseStaffSyncOptions = {}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const syncStaffRecords = async () => {
    try {
      setIsSyncing(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast({
          title: "Error",
          description: "You must be signed in to sync staff records",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase.functions.invoke("sync-staff-records", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`
        }
      });
      
      if (error) {
        console.error("Error syncing staff records:", error);
        toast({
          title: "Sync Failed",
          description: error.message || "Failed to sync staff records",
          variant: "destructive"
        });
        return;
      }
      
      if (data.success) {
        console.log("Sync successful:", data);
        const syncedCount = data.data.synced.length;
        const errorCount = data.data.errors.length;
        
        toast({
          title: "Staff Records Synced",
          description: `Successfully synced ${syncedCount} staff records${errorCount > 0 ? `, with ${errorCount} errors` : ''}.`,
          variant: "default"
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: "Sync Failed",
          description: data.error || "Failed to sync staff records",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error in sync operation:", err);
      toast({
        title: "Sync Error",
        description: "An unexpected error occurred during sync",
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
