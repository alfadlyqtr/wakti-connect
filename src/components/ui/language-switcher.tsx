
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Flag } from "lucide-react";

const LanguageSwitcher = () => {
  const handleLanguageChange = () => {
    toast("Language Notice", {
      description: (
        <div className="flex items-center gap-2">
          <span>Arabic is coming soon in our next update</span>
          <br />
          <span dir="rtl">اللغة العربية قادمة قريبًا في التحديث القادم</span>
          <Flag className="h-4 w-4" />
        </div>
      ),
      duration: 3000,
    });
  };

  return (
    <Button 
      onClick={handleLanguageChange}
      variant="ghost" 
      size="sm" 
      className="w-8 px-0"
    >
      العربية
    </Button>
  );
};

export default LanguageSwitcher;
