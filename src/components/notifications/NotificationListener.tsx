
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from '@/components/ui/use-toast';

export const NotificationListener: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Set up real-time notifications listener
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        const notification = payload.new as any;
        
        // Display a toast notification for the new notification
        toast({
          title: notification.title || 'New Notification',
          description: notification.message,
          duration: 5000,
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return null;
};
