
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, TrendingUp, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBusinessReports } from "@/hooks/useBusinessReports";
import { useBusinessAnalytics } from "@/hooks/useBusinessAnalytics";

interface BusinessAnalyticsPreviewProps {
  profileData?: {
    account_type: "business" | "individual";
    business_name?: string | null;
  };
}

const BusinessAnalyticsPreview: React.FC<BusinessAnalyticsPreviewProps> = ({ profileData }) => {
  const navigate = useNavigate();
  const { 
    subscriberCount,
    subscribersLoading,
    staffCount,
    staffLoading,
    serviceCount,
    servicesLoading
  } = useBusinessReports();
  
  const { data: analyticsData, isLoading: analyticsLoading } = useBusinessAnalytics('month');
  
  return (
    <Card className="bg-gradient-to-br from-[#9b87f5]/10 via-white/80 to-[#8B5CF6]/10 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart className="h-5 w-5 text-purple-500" />
          Business Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-medium">Subscribers</h3>
            </div>
            {subscribersLoading ? (
              <div className="animate-pulse h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">{subscriberCount || 0}</p>
            )}
          </div>
          
          <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-green-500" />
              <h3 className="text-sm font-medium">Staff</h3>
            </div>
            {staffLoading ? (
              <div className="animate-pulse h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">{staffCount || 0}</p>
            )}
          </div>
          
          <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <h3 className="text-sm font-medium">Task Completion</h3>
            </div>
            {analyticsLoading ? (
              <div className="animate-pulse h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">{analyticsData?.taskCompletionRate || 0}%</p>
            )}
          </div>
          
          <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-orange-500" />
              <h3 className="text-sm font-medium">Services</h3>
            </div>
            {servicesLoading ? (
              <div className="animate-pulse h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">{serviceCount || 0}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 pt-3 pb-3">
        <Button 
          size="sm" 
          className="ml-auto"
          onClick={() => navigate('/dashboard/analytics')}
        >
          View Full Analytics
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BusinessAnalyticsPreview;
