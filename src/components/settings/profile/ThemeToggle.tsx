import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ThemeToggleProps {
  initialTheme?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ initialTheme = "light" }) => {
  const { theme, setTheme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    if (initialTheme) {
      setTheme(initialTheme as "light" | "dark" | "system");
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(initialTheme);
    }
  }, [initialTheme, setTheme]);
  
  const updateThemePreference = async (newTheme: string) => {
    if (!user?.id) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          theme_preference: newTheme,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      
      toast({
        title: "Theme updated",
        description: `Theme preference set to ${newTheme}.`
      });
    } catch (error) {
      console.error("Error updating theme:", error);
      toast({
        title: "Update failed",
        description: "Could not update theme preference.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    updateThemePreference(newTheme);
  };
  
  return (
    <div className="flex flex-row gap-4">
      <Button
        variant={theme === "light" ? "default" : "outline"}
        className={`flex-1 ${theme === "light" ? "bg-wakti-blue hover:bg-wakti-blue/90" : ""}`}
        onClick={() => handleThemeChange("light")}
        disabled={isUpdating}
      >
        <Sun className="h-5 w-5 mr-2" />
        Light Mode
      </Button>
      
      <Button
        variant={theme === "dark" ? "default" : "outline"}
        className={`flex-1 ${theme === "dark" ? "bg-wakti-blue hover:bg-wakti-blue/90" : ""}`}
        onClick={() => handleThemeChange("dark")}
        disabled={isUpdating}
      >
        <Moon className="h-5 w-5 mr-2" />
        Dark Mode
      </Button>
    </div>
  );
};

export default ThemeToggle;
