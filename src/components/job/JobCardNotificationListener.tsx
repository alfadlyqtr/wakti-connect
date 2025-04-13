
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const JobCardNotificationListener = () => {
  const { toast } = useToast();
  const userRole = localStorage.getItem('userRole');
  
  useEffect(() => {
    // Only business owners should listen for job card notifications
    if (userRole !== 'business') return;
    
    console.log("Setting up job card notification listener for business owner");
    
    // Listen for new notifications in the notifications table
    const channel = supabase
      .channel('job-card-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `type=eq.job`,
        },
        (payload) => {
          console.log("New job card notification:", payload);
          
          if (payload.new) {
            // Show toast notification to business owner
            toast({
              title: payload.new.title || 'New Job Card Update',
              description: payload.new.content || 'A job card has been updated',
              variant: "default",
            });
          }
        }
      )
      .subscribe();
    
    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, userRole]);
  
  // This is a utility component that doesn't render anything
  return null;
};

export default JobCardNotificationListener;
