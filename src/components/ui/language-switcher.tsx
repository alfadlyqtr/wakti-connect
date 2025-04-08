
import React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function LanguageSwitcher() {
  // Show Arabic coming soon message when clicked
  const showComingSoonMessage = () => {
    toast({
      title: "Arabic Coming Soon",
      description: "Arabic language support will be available in our next update.",
      duration: 5000,
    });
  };

  // Display English and a non-functional Arabic button
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="px-3 flex items-center gap-1.5" 
      onClick={showComingSoonMessage}
      title="Arabic Coming Soon"
    >
      <Globe className="h-4 w-4" />
      <span>English</span>
    </Button>
  );
}

export default LanguageSwitcher;
