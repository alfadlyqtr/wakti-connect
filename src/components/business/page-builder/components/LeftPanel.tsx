
import React from "react";
import { useBusinessPage } from "../context/BusinessPageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageSetupSection } from "./sections/PageSetupSection";
import { LogoSection } from "./sections/LogoSection";
import { BookingsSection } from "./sections/BookingsSection";
import { SocialInlineSection } from "./sections/SocialInlineSection";
import { WorkingHoursSection } from "./sections/WorkingHoursSection";
import { ChatbotSection } from "./sections/ChatbotSection";
import { ThemeOptionsSection } from "./sections/ThemeOptionsSection";
import { SocialSidebarSection } from "./sections/SocialSidebarSection";

export const LeftPanel = () => {
  const { pageData, updatePageData } = useBusinessPage();
  
  const handleReorderSections = (startIndex: number, endIndex: number) => {
    const result = Array.from(pageData.sectionOrder);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    updatePageData({ sectionOrder: result });
  };

  return (
    <div className="w-80 border-r bg-card flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Page Builder</h2>
        <p className="text-sm text-muted-foreground">
          Configure your business landing page
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <PageSetupSection />
          <LogoSection />
          <BookingsSection />
          <SocialInlineSection />
          <WorkingHoursSection />
          <ChatbotSection />
          <ThemeOptionsSection />
          <SocialSidebarSection />
        </div>
      </ScrollArea>
    </div>
  );
};
