
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface AccountMenuItemsProps {
  isAuthenticated: boolean;
}

const AccountMenuItems = ({ isAuthenticated }: AccountMenuItemsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <DropdownMenuItem asChild>
        <Link to="/dashboard/settings">
          <Settings className="h-4 w-4 mr-2" />
          {t('dashboard.settings')}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {isAuthenticated ? (
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          {t('common.logOut')}
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem asChild>
          <Link to="/auth">{t('common.logIn')} / {t('common.signUp')}</Link>
        </DropdownMenuItem>
      )}
    </>
  );
};

export default AccountMenuItems;
