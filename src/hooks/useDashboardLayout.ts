
import { useState, useEffect } from 'react';
import { DashboardWidgetLayout, WidgetType } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardLayout = () => {
  const [layout, setLayout] = useState<DashboardWidgetLayout[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    
    fetchUser();
  }, []);
  
  // Load layout from localStorage or DB when userId is available
  useEffect(() => {
    if (!userId) return;
    
    const loadLayout = async () => {
      try {
        // Try to load from localStorage first for quicker startup
        const savedLayout = localStorage.getItem(`dashboard_layout_${userId}`);
        if (savedLayout) {
          try {
            const parsedLayout = JSON.parse(savedLayout);
            if (Array.isArray(parsedLayout)) {
              setLayout(parsedLayout);
            }
          } catch (parseError) {
            console.error('Error parsing dashboard layout from localStorage:', parseError);
          }
        }
        
        // Then try to load from DB (for cross-device sync)
        const { data, error } = await supabase
          .from('user_preferences')
          .select('dashboard_layout')
          .eq('user_id', userId)
          .single();
        
        if (!error && data?.dashboard_layout) {
          try {
            // Ensure we have a proper array of DashboardWidgetLayout objects
            const dbLayout = data.dashboard_layout;
            if (Array.isArray(dbLayout)) {
              setLayout(dbLayout);
              localStorage.setItem(`dashboard_layout_${userId}`, JSON.stringify(dbLayout));
            }
          } catch (dbParseError) {
            console.error('Error processing dashboard layout from DB:', dbParseError);
          }
        }
      } catch (error) {
        console.error('Error loading dashboard layout:', error);
      }
    };
    
    loadLayout();
  }, [userId]);
  
  // Save layout to localStorage and DB when it changes
  const saveLayout = async (newLayout: DashboardWidgetLayout[]) => {
    if (!userId) return;
    
    setLayout(newLayout);
    
    try {
      // Save to localStorage for quick access
      localStorage.setItem(`dashboard_layout_${userId}`, JSON.stringify(newLayout));
      
      // Save to DB for persistence across devices
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          dashboard_layout: newLayout as any // Type assertion for DB compatibility
        }, {
          onConflict: 'user_id'
        });
    } catch (error) {
      console.error('Error saving dashboard layout:', error);
    }
  };

  return {
    layout,
    setLayout: saveLayout,
  };
};
