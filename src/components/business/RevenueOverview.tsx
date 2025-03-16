
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, DollarSign, Calendar } from "lucide-react";

interface RevenueOverviewProps {
  serviceCount: number | null;
  servicesLoading: boolean;
  onDownload: () => void;
}

export const RevenueOverview = ({ serviceCount, servicesLoading, onDownload }: RevenueOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Financial performance analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Monthly Revenue</p>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">$5,240</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+12%</span>
                <span className="ml-1">from last month</span>
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Average Booking Value</p>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">$67.18</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+3.2%</span>
                <span className="ml-1">from last month</span>
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Services Offered</p>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {servicesLoading ? (
                  <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
                ) : (
                  serviceCount
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Active services available for booking
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button variant="outline" className="w-full" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Detailed Report
        </Button>
      </CardFooter>
    </Card>
  );
};
