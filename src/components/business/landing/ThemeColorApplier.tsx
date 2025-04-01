
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
        secondary: businessPage.secondary_color
      });
      
      if (businessPage.primary_color) {
        document.documentElement.style.setProperty('--primary', businessPage.primary_color);
        document.documentElement.style.setProperty('--primary-rgb', hexToRGB(businessPage.primary_color));
      }
      
      if (businessPage.secondary_color) {
        document.documentElement.style.setProperty('--secondary', businessPage.secondary_color);
        document.documentElement.style.setProperty('--secondary-rgb', hexToRGB(businessPage.secondary_color));
      }
    }
    
    return () => {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-rgb');
      document.documentElement.style.removeProperty('--secondary');
      document.documentElement.style.removeProperty('--secondary-rgb');
    };
  }, [businessPage]);

  return null;
};

export default ThemeColorApplier;
