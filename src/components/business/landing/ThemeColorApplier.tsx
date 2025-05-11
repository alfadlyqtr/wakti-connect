
import { useEffect } from "react";
import { BusinessPage } from "@/types/business.types";

interface ThemeColorApplierProps {
  businessPage: BusinessPage | null;
}

function hexToRGB(hex: string): string {
  if (!hex || !hex.startsWith('#')) return '0, 0, 0';
  
  hex = hex.replace('#', '');
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}

const ThemeColorApplier: React.FC<ThemeColorApplierProps> = ({ businessPage }) => {
  useEffect(() => {
    if (businessPage) {
      console.log("Applying theme colors:", {
        primary: businessPage.primary_color,
        secondary: businessPage.secondary_color,
        text: businessPage.text_color,
        background: businessPage.background_color
      });
      
      if (businessPage.primary_color) {
        document.documentElement.style.setProperty('--primary', businessPage.primary_color);
        document.documentElement.style.setProperty('--primary-rgb', hexToRGB(businessPage.primary_color));
      }
      
      if (businessPage.secondary_color) {
        document.documentElement.style.setProperty('--secondary', businessPage.secondary_color);
        document.documentElement.style.setProperty('--secondary-rgb', hexToRGB(businessPage.secondary_color));
      }
      
      // Apply text color if available
      if (businessPage.text_color) {
        document.documentElement.style.setProperty('--business-text-color', businessPage.text_color);
      } else {
        // Default to dark text for better contrast
        document.documentElement.style.setProperty('--business-text-color', '#333333');
      }
      
      // Apply background color if available
      if (businessPage.background_color) {
        document.documentElement.style.setProperty('--business-bg-color', businessPage.background_color);
      } else {
        // Default to light background
        document.documentElement.style.setProperty('--business-bg-color', '#FFFFFF');
      }
    }
    
    return () => {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-rgb');
      document.documentElement.style.removeProperty('--secondary');
      document.documentElement.style.removeProperty('--secondary-rgb');
      document.documentElement.style.removeProperty('--business-text-color');
      document.documentElement.style.removeProperty('--business-bg-color');
    };
  }, [businessPage]);

  return null;
};

export default ThemeColorApplier;
