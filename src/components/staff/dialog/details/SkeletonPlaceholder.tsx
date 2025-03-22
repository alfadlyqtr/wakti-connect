
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";

interface SkeletonPlaceholderProps {
  activeTab: string;
}

export const SkeletonPlaceholder: React.FC<SkeletonPlaceholderProps> = ({ activeTab }) => {
  return (
    <>
      {/* Common tab list placeholder */}
      <div className="w-full mb-6">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {activeTab === "details" ? (
        <TabsContent value="details" forceMount className="space-y-4 py-4">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar placeholder */}
            <div className="flex flex-col items-center space-y-2">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
            
            {/* Form fields placeholder */}
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="space-y-2 mt-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        </TabsContent>
      ) : (
        <TabsContent value="permissions" forceMount className="space-y-4 py-4">
          {/* Permissions tab placeholder */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <div className="grid gap-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>
            
            <div>
              <Skeleton className="h-5 w-40 mb-2" />
              <div className="grid gap-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>
            
            <div>
              <Skeleton className="h-5 w-36 mb-2" />
              <div className="grid gap-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>
          </div>
        </TabsContent>
      )}
      
      {/* Footer actions placeholder */}
      <div className="flex justify-between pt-4 mt-4 border-t">
        <Skeleton className="h-10 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </>
  );
};
