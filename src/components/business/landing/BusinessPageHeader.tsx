
import React from "react";
import { BusinessProfile } from "@/types/business.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BusinessPageHeaderProps {
  business: BusinessProfile;
  isPreviewMode?: boolean;
  isAuthenticated: boolean | null;
}

const BusinessPageHeader: React.FC<BusinessPageHeaderProps> = ({
  business,
  isPreviewMode = false,
  isAuthenticated
}) => {
  const isOwner = business.id === isAuthenticated;

  const { business_name, display_name, avatar_url } = business;
  const name = display_name || business_name || "Business";
  
  // Get initials from business name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const copyToClipboard = () => {
    const url = window.location.href.split('/preview')[0]; // Remove /preview if present
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          description: "Page URL copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          variant: "destructive",
          description: "Failed to copy. Please try again.",
        });
      });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between py-4 mb-6">
      <div className="flex items-center mb-4 sm:mb-0">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={avatar_url || ''} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-lg leading-tight">{name}</h1>
          {isPreviewMode && (
            <div className="text-xs text-muted-foreground">Preview Mode</div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        {isPreviewMode && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            className="flex items-center gap-1"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy URL</span>
          </Button>
        )}
        
        {isOwner && (
          <Button 
            variant="default"
            size="sm"
            asChild
            className="flex items-center gap-1"
          >
            <Link to="/dashboard/business-page">
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Page</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default BusinessPageHeader;
