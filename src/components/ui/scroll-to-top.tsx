
import React, { useState, useEffect } from "react";
import { CircleArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/use-theme";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Check if we've scrolled past 50% of the page height
  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // Show button when scrolled past 50% of the scrollable area
    const scrollThreshold = (scrollHeight - clientHeight) * 0.5;
    setIsVisible(scrollTop > scrollThreshold);
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Determine button colors based on theme
  const buttonClasses = 
    `fixed z-50 flex items-center justify-center p-2 rounded-full 
    glass-card transition-all duration-300 transform 
    ${isVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'} 
    hover:opacity-100 hover:scale-110 focus:outline-none`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={buttonClasses}
            onClick={scrollToTop}
            aria-label={t("scrollToTop")}
            style={{
              right: "1.5rem", 
              bottom: "25vh" // Position at 75% down (from top) = 25% up from bottom
            }}
          >
            <CircleArrowUp className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{t("scrollToTop", "Scroll to top")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ScrollToTop;
