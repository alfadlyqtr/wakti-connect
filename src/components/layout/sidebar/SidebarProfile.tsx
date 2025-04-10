
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cva } from "class-variance-authority";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types/user";

interface SidebarProfileData {
  id?: string;
  full_name?: string | null;
  display_name?: string | null;
  business_name?: string | null;
  account_type?: UserRole;
  avatar_url?: string | null;
}

interface SidebarProfileProps {
  profileData: SidebarProfileData | null;
  collapsed: boolean;
}

const profileContainerVariants = cva(
  "flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md transition-all duration-200",
  {
    variants: {
      collapsed: {
        true: "justify-center flex-col px-1",
        false: "px-3 flex-row",
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
);

const SidebarProfile: React.FC<SidebarProfileProps> = ({ profileData, collapsed }) => {
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    navigate("/dashboard/settings");
  };
  
  const getProfileInfo = () => {
    if (!profileData) return { name: "User", type: "" };
    
    const name = profileData.display_name || profileData.full_name || "User";
    
    let type = "";
    switch (profileData.account_type) {
      case "business":
        type = profileData.business_name || "Business";
        break;
      case "individual":
        type = "Individual";
        break;
      case "staff":
        type = "Staff";
        break;
      case "super-admin":
        type = "Super Admin";
        break;
      default:
        type = "Free";
    }
    
    return { name, type };
  };
  
  const { name, type } = getProfileInfo();
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="px-3 py-2">
      <div
        className={profileContainerVariants({ collapsed })}
        onClick={handleProfileClick}
      >
        <Avatar className={collapsed ? "h-10 w-10" : "h-9 w-9"}>
          <AvatarImage src={profileData?.avatar_url || ""} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium truncate text-sm">{name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {type}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarProfile;
