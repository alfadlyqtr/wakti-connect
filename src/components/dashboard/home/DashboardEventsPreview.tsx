
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types/user";

interface DashboardEventsPreviewProps {
  userRole: UserRole;
}

const DashboardEventsPreview: React.FC<DashboardEventsPreviewProps> = ({ userRole }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-gradient-to-br from-[#6366F1]/10 via-white/80 to-[#8B5CF6]/10 dark:from-gray-900 dark:to-gray-800 shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-500" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Our events system is currently being rebuilt.
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 pt-3 pb-3">
        <Button 
          size="sm" 
          className="ml-auto"
          onClick={() => navigate('/dashboard/events')}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {userRole === "business" || userRole === "super-admin" ? "Manage Events" : "View All Events"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardEventsPreview;
