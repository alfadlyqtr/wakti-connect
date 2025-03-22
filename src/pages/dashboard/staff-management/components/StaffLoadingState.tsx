
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StaffLoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((idx) => (
        <Card key={idx} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
              
              <Skeleton className="h-6 w-36 mt-4" />
              <Skeleton className="h-4 w-24 mt-2" />
              
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <div className="flex flex-wrap gap-1 mt-2">
                  <Skeleton className="h-4 w-14 rounded-full" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                </div>
              </div>
              
              <Skeleton className="h-9 w-full mt-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StaffLoadingState;
