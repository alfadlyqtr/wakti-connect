
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/context/AuthContext";

interface AccountMenuItemsProps {
  isAuthenticated: boolean;
}

const AccountMenuItems = ({ isAuthenticated }: AccountMenuItemsProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <DropdownMenuItem asChild>
        <Link to="/dashboard/settings" className="flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Link>
      </DropdownMenuItem>
      
      <DropdownMenuItem asChild>
        <Link to="/dashboard/profile" className="flex items-center">
          <User className="h-4 w-4 mr-2" />
          Account/Profile
        </Link>
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      {isAuthenticated ? (
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive flex items-center">
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem asChild>
          <Link to="/auth">Log In / Sign Up</Link>
        </DropdownMenuItem>
      )}
    </>
  );
};

export default AccountMenuItems;
