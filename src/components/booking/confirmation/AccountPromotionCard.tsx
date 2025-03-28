
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
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
        <h3 className="text-lg font-medium mb-2">Get More From Your Bookings</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Create a free WAKTI account to manage all your bookings in one place, 
          get automated reminders, and schedule future appointments easily.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button 
          className="w-full sm:w-auto" 
          onClick={() => navigate("/register")}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Create Account
        </Button>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto" 
          onClick={() => navigate("/login")}
        >
          <LogIn className="mr-2 h-4 w-4" /> Sign In
        </Button>
        <Button 
          variant="ghost" 
          className="w-full sm:w-auto" 
          onClick={onCalendarExport}
        >
          Not Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountPromotionCard;
