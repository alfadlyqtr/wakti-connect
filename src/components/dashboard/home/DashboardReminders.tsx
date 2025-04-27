
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

const DashboardReminders = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center text-muted-foreground py-8">
          <Bell className="h-5 w-5 mr-2" />
          <span>No active reminders</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardReminders;
