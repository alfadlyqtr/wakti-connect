
import React, { useState } from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionEditor from "../section-editors/SectionEditor";

interface SectionCardProps {
  section: BusinessPageSection;
  actionsComponent?: React.ReactNode;
  displayOrder?: number;
}

const sectionTypeLabels: Record<string, string> = {
  header: "Header",
  about: "About",
  contact: "Contact",
  gallery: "Gallery",
  hours: "Opening Hours",
  testimonials: "Testimonials",
  booking: "Booking",
  instagram: "Instagram"
};

const SectionCard: React.FC<SectionCardProps> = ({ 
  section, 
  actionsComponent, 
  displayOrder 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get the section title from section_content if available, or use section type label
  const sectionTitle = section.section_content?.title || 
                       sectionTypeLabels[section.section_type] || 
                       "Unnamed Section";
  
  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };
  
  return (
    <Card className={cn(
      "mb-3 transition-all duration-200 hover:border-primary/50",
      !section.is_visible && "opacity-60 border-dashed"
    )}>
      <CardHeader 
        className={cn(
          "p-3 sm:p-4 flex flex-row items-center justify-between space-y-0 cursor-pointer",
          isExpanded && "border-b border-border"
        )}
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-2">
          {displayOrder !== undefined && (
            <Badge variant="outline" className="text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
              {displayOrder}
            </Badge>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{sectionTitle}</span>
              {!section.is_visible && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <EyeOff className="h-3 w-3" />
                  Hidden
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {sectionTypeLabels[section.section_type] || section.section_type}
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 mr-2 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-2 text-muted-foreground" />
          )}
          {actionsComponent}
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        "overflow-hidden transition-all",
        isExpanded ? "p-4 mt-2" : "p-0 h-0"
      )}>
        {isExpanded && <SectionEditor section={section} />}
      </CardContent>
    </Card>
  );
};

export default SectionCard;
