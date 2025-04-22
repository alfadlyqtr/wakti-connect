
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellRing, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import RemindersList from "@/components/reminders/RemindersList";
import RemindersContainer from "@/components/reminders/RemindersContainer";

interface RemindersOverviewProps {
  userRole: "individual" | "business" | "staff" | "super-admin";
}

const RemindersOverview: React.FC<RemindersOverviewProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const isPaidAccount = userRole !== "free";
  
  return (
    <Card className="bg-gradient-to-br from-[#D6BCFA]/10 via-white/80 to-[#9b87f5]/10 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BellRing className="h-5 w-5 text-purple-500" />
          Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RemindersContainer 
          userRole={userRole} 
          isPaidAccount={isPaidAccount} 
        />
      </CardContent>
    </Card>
  );
};

export default RemindersOverview;
