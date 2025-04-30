
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
        <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
          <CalendarDays className="h-5 w-5 mb-2" />
          <span>Our events system is currently being rebuilt</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardEvents;
