
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DashboardEvents = () => {
  const navigate = useNavigate();

  const handleViewAllEvents = () => {
    navigate('/dashboard/events');
  };

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
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleViewAllEvents}>
          View All Events
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardEvents;
