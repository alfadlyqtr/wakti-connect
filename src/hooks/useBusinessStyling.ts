
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BusinessStyling {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  textColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
}

// Helper function to convert HEX to RGB
function hexToRGB(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values to get r, g, b
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Return RGB value as comma-separated string
  return `${r}, ${g}, ${b}`;
}

export const useBusinessStyling = (businessId?: string) => {
  const [styling, setStyling] = useState<BusinessStyling>({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!businessId) return;
    
    const fetchBusinessStyling = async () => {
      setIsLoading(true);
      console.log("Fetching business styling for:", businessId);
      
      try {
        // First check if business has a page with styling
        const { data: pageData, error: pageError } = await supabase
          .from('business_pages')
          .select('primary_color, secondary_color, logo_url, text_color, background_color, font_family')
          .eq('business_id', businessId)
          .single();
          
        console.log("Business page data:", pageData, "Error:", pageError);
        
        if (!pageError && pageData) {
          setStyling({
            primaryColor: pageData.primary_color,
            secondaryColor: pageData.secondary_color,
            logoUrl: pageData.logo_url,
            textColor: pageData.text_color,
            backgroundColor: pageData.background_color,
            fontFamily: pageData.font_family
          });
          
          console.log("Setting styling from business page:", {
            primaryColor: pageData.primary_color,
            secondaryColor: pageData.secondary_color,
            logoUrl: pageData.logo_url,
            textColor: pageData.text_color,
            backgroundColor: pageData.background_color,
            fontFamily: pageData.font_family
          });
          
          // Apply CSS variables
          if (pageData.primary_color) {
            document.documentElement.style.setProperty('--primary', pageData.primary_color);
            document.documentElement.style.setProperty('--primary-rgb', hexToRGB(pageData.primary_color));
          }
          if (pageData.secondary_color) {
            document.documentElement.style.setProperty('--secondary', pageData.secondary_color);
            document.documentElement.style.setProperty('--secondary-rgb', hexToRGB(pageData.secondary_color));
          }
          
        } else {
          // Fallback to profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', businessId)
            .single();
          
          console.log("Profile data:", profileData, "Error:", profileError);
            
          if (!profileError && profileData) {
            setStyling({
              logoUrl: profileData.avatar_url
            });
            
            console.log("Setting styling from profile:", {
              logoUrl: profileData.avatar_url
            });
          }
        }
      } catch (error) {
        console.error('Error fetching business styling:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinessStyling();
    
    return () => {
      // Clean up CSS variables
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-rgb');
      document.documentElement.style.removeProperty('--secondary');
      document.documentElement.style.removeProperty('--secondary-rgb');
    };
  }, [businessId]);
  
  return {
    styling,
    isLoading
  };
};
