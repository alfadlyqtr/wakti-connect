
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  
  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    // Apply theme
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    
    // If user is logged in, save preference to database
    if (user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({ 
            theme_preference: newTheme,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        toast({
          title: "Theme updated",
          description: `Theme preference set to ${newTheme}.`
        });
      } catch (error) {
        console.error("Failed to save theme preference:", error);
        toast({
          title: "Update failed",
          description: "Could not save theme preference.",
          variant: "destructive"
        });
      }
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="text-foreground hover:text-foreground"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
};

export default ThemeToggle;
