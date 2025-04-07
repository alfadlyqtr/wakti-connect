
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Calendar, CheckSquare, MessageSquare, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface AccountPromotionCardProps {
  onCalendarExport: () => void;
}

const AccountPromotionCard: React.FC<AccountPromotionCardProps> = ({ 
  onCalendarExport 
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card className="border-dashed border-primary/50 bg-primary/5 mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">{t("accountPromotion.getMore")}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {t("accountPromotion.createAccount")}
        </p>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-start space-x-2">
            <Calendar className="h-4 w-4 text-primary mt-0.5" />
            <span className="text-xs">{t("accountPromotion.manageBookings")}</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckSquare className="h-4 w-4 text-primary mt-0.5" />
            <span className="text-xs">{t("accountPromotion.trackTasks")}</span>
          </div>
          <div className="flex items-start space-x-2">
            <MessageSquare className="h-4 w-4 text-primary mt-0.5" />
            <span className="text-xs">{t("accountPromotion.messageBusinesses")}</span>
          </div>
          <div className="flex items-start space-x-2">
            <Building className="h-4 w-4 text-primary mt-0.5" />
            <span className="text-xs">{t("accountPromotion.createBusiness")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button variant="default" onClick={() => navigate("/auth/register")}>
          <UserPlus className="h-4 w-4 mr-2" />
          {t("common.createAccount")}
        </Button>
        <Button variant="outline" onClick={() => navigate("/auth/login")}>
          <LogIn className="h-4 w-4 mr-2" />
          {t("common.signIn")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountPromotionCard;
