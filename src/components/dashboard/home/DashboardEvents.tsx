
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

const DashboardEvents = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center text-muted-foreground py-8">
          <CalendarDays className="h-5 w-5 mr-2" />
          <span>No upcoming events</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardEvents;
