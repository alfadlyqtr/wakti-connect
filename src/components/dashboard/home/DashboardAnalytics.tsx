
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

const DashboardAnalytics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center text-muted-foreground py-8">
          <BarChart2 className="h-5 w-5 mr-2" />
          <span>Analytics data will appear here</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardAnalytics;
