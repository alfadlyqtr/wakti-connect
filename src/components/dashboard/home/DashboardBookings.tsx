
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const DashboardBookings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center text-muted-foreground py-8">
          <Calendar className="h-5 w-5 mr-2" />
          <span>No upcoming bookings</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardBookings;
