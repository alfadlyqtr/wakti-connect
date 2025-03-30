
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { TeamActivityChart } from "@/components/analytics/TeamActivityChart";

export const StaffTabContent: React.FC = () => {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1">
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>Staff Activity Hours</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] sm:h-[400px] pt-0">
          <TeamActivityChart />
        </CardContent>
      </Card>
      
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>Staff Availability & Utilization</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Staff Availability</h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { name: 'John Doe', availability: '90%', hours: 38 },
                  { name: 'Jane Smith', availability: '85%', hours: 42 },
                  { name: 'Bob Johnson', availability: '75%', hours: 32 },
                  { name: 'Alice Williams', availability: '95%', hours: 40 },
                ].map((staff) => (
                  <div key={staff.name} className="flex justify-between items-center p-2 sm:p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium text-sm sm:text-base">{staff.name}</p>
                      <p className="text-xs text-muted-foreground">{staff.hours} hrs/week</p>
                    </div>
                    <div className="bg-background px-2 py-1 rounded text-xs sm:text-sm font-medium">
                      {staff.availability}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Staff Utilization</h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium">Service Allocation</span>
                    <span className="text-xs sm:text-sm font-medium">78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium">Administrative Tasks</span>
                    <span className="text-xs sm:text-sm font-medium">15%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium">Training</span>
                    <span className="text-xs sm:text-sm font-medium">7%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '7%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6">
                <h4 className="font-medium mb-2 text-sm sm:text-base">Staff Contribution to Revenue</h4>
                <div className="p-2 sm:p-3 bg-muted rounded-md">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Top Performer</p>
                      <p className="font-medium text-sm sm:text-base">Jane Smith</p>
                      <p className="text-xs text-muted-foreground">32% of total revenue</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Most Bookings</p>
                      <p className="font-medium text-sm sm:text-base">John Doe</p>
                      <p className="text-xs text-muted-foreground">42 this month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
