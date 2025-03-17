import React from "react";
import { BusinessProfile } from "@/types/business.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import BusinessSubscribeButton from "./BusinessSubscribeButton";

interface BusinessPageHeaderProps {
  business: BusinessProfile;
  isOwner?: boolean;
}

const BusinessPageHeader = ({ business, isOwner }: BusinessPageHeaderProps) => {
  return (
    <header className="relative">
      <div
        className="absolute inset-0 h-48 bg-muted rounded-md"
        style={{
          backgroundImage: `url(${business.avatar_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/20 rounded-md" />
      </div>
      
      <div className="container px-4 sm:px-6 pt-6 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={business.avatar_url} alt={business.business_name} />
            <AvatarFallback>{business.business_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white">{business.business_name}</h1>
            <p className="text-muted-foreground text-sm">
              {business.account_type} account
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* Add Subscribe button */}
          <BusinessSubscribeButton businessId={business.id} />
          
          {isOwner && (
            <>
              <Button asChild variant="outline">
                <Link to="/dashboard/business/page">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Page
                </Link>
              </Button>
              <Button asChild>
                <Link to="/dashboard/business/page/section/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default BusinessPageHeader;
