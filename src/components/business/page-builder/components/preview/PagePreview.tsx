
import React from "react";
import { useBusinessPage } from "../../context/BusinessPageContext";
import { PageHeader } from "./PageHeader";
import { LogoPreview } from "./LogoPreview";
import { BookingsPreview } from "./BookingsPreview";
import { SocialInlinePreview } from "./SocialInlinePreview";
import { ChatbotPreview } from "./ChatbotPreview";
import { SocialSidebarPreview } from "./SocialSidebarPreview";

export const PagePreview = () => {
  const { pageData } = useBusinessPage();
  const { theme, sectionOrder } = pageData;
  
  // Map section IDs to their components - removed workingHours
  const sectionComponents: Record<string, React.ReactNode> = {
    pageSetup: <PageHeader key="pageSetup" />,
    logo: <LogoPreview key="logo" />,
    bookings: <BookingsPreview key="bookings" />,
    socialInline: <SocialInlinePreview key="socialInline" />,
  };
  
  // Filter and order visible sections
  const visibleSections = sectionOrder
    .filter(sectionId => {
      const section = pageData[sectionId as keyof typeof pageData];
      return section && typeof section === 'object' && 'visible' in section ? section.visible : true;
    })
    .map(sectionId => sectionComponents[sectionId]);

  return (
    <div
      className="min-h-full p-6"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontStyle,
      }}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {visibleSections}
      </div>
      
      {/* Fixed position elements */}
      {pageData.chatbot.visible && <ChatbotPreview />}
      {pageData.socialSidebar.visible && <SocialSidebarPreview />}
    </div>
  );
};
