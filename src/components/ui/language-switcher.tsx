
import React from "react";
import { Button } from "@/components/ui/button";
import { Globe, Flag } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function LanguageSwitcher() {
  // Show Arabic coming soon message when clicked
  const showComingSoonMessage = () => {
    toast({
      title: "Arabic Coming Soon",
      description: (
        <div className="flex items-center gap-2">
          <div className="h-4 w-6 relative overflow-hidden" style={{ borderRadius: '2px' }}>
            {/* Qatar flag - maroon background with white vertical section */}
            <div className="absolute inset-0" style={{ background: '#8d1b3d' }}></div>
            <div className="absolute top-0 bottom-0 left-0" style={{ 
              background: 'white',
              width: '30%',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 25% 10%, 0 20%, 25% 30%, 0 40%, 25% 50%, 0 60%, 25% 70%, 0 80%, 25% 90%)'
            }}></div>
          </div>
          <span>Arabic language support will be available in our next update.</span>
          <br/>
          <span>اللغة العربية قادمة قريبًا في التحديث القادم</span>
        </div>
      ),
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
