
import { useState, useEffect } from 'react';
import { DashboardWidgetLayout } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/types/supabase";

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
          const parsedLayout = JSON.parse(savedLayout);
          if (Array.isArray(parsedLayout) && parsedLayout.length > 0 && 
              'id' in parsedLayout[0] && 'order' in parsedLayout[0]) {
            setLayout(parsedLayout as DashboardWidgetLayout[]);
          }
        }
        
        // Then try to load from DB (for cross-device sync)
        const { data, error } = await supabase
          .from('user_preferences')
          .select('dashboard_layout')
          .eq('user_id', userId)
          .single();
        
        if (!error && data?.dashboard_layout) {
          const dbLayout = data.dashboard_layout;
          if (Array.isArray(dbLayout) && dbLayout.length > 0) {
            // Properly validate and convert the JSON data to DashboardWidgetLayout[]
            const typedLayout = dbLayout.map(item => {
              // Since item could be of unknown structure, we need to safely access properties
              const itemObj = item as unknown as Record<string, unknown>;
              return {
                id: String(itemObj.id || ''),
                order: Number(itemObj.order || 0)
              };
            });
            
            setLayout(typedLayout);
            localStorage.setItem(`dashboard_layout_${userId}`, JSON.stringify(typedLayout));
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
      
      // Convert to a format suitable for Supabase storage
      const jsonLayout = newLayout.map(item => ({
        id: item.id,
        order: item.order
      }));
      
      // Save to DB for persistence across devices
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          dashboard_layout: jsonLayout as unknown as Json
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
