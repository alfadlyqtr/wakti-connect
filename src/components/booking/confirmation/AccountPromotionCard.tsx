
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Calendar, CheckSquare, MessageSquare, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccountPromotionCardProps {
  onCalendarExport: () => void;
}

const AccountPromotionCard: React.FC<AccountPromotionCardProps> = ({ 
  onCalendarExport 
}) => {
  const navigate = useNavigate();

  return (
    <Card className="border-dashed border-primary/50 bg-primary/5 mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">Get More with WAKTI</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Create a free account to manage your bookings and more
        </p>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-start space-x-2">
            <Calendar className="h-4 w-4 text-primary mt-0.5" />
            <span className="text-xs">Manage bookings</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckSquare className="h-4 w-4 text-primary mt-0.5" />
            <span className="text-xs">Track tasks</span>
          </div>
          <div className="flex items-start space-x-2">
            <MessageSquare className="h-4 w-4 text-primary mt-0.5" />
            <span className="text-xs">Message businesses</span>
          </div>
          <div className="flex items-start space-x-2">
            <Building className="h-4 w-4 text-primary mt-0.5" />
            <span className="text-xs">Create business profiles</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button variant="default" onClick={() => navigate("/auth/register")}>
          <UserPlus className="h-4 w-4 mr-2" />
          Create Account
        </Button>
        <Button variant="outline" onClick={() => navigate("/auth/login")}>
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountPromotionCard;
