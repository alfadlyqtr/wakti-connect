
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, PieChart, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BusinessAnalyticsPreviewProps {
  profileData: {
    account_type: "individual" | "business";
    business_name?: string;
  };
}

const BusinessAnalyticsPreview: React.FC<BusinessAnalyticsPreviewProps> = ({ profileData }) => {
  const navigate = useNavigate();
  const isBusinessAccount = profileData.account_type === "business";
  
  return (
    <Card className="bg-gradient-to-br from-[#6563ff]/10 via-white/80 to-[#482dff]/10 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          {isBusinessAccount ? "Business Analytics" : "Personal Analytics"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Customers</span>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">
              {isBusinessAccount ? "152" : "24"}
            </p>
            <span className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              12% increase
            </span>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <PieChart className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">
              {isBusinessAccount ? "$1,250" : "$320"}
            </p>
            <span className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              8% increase
            </span>
          </div>
        </div>
        
        <div className="h-48 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-muted-foreground">
            {isBusinessAccount 
              ? "View detailed analytics and growth metrics" 
              : "Track your personal performance"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 pt-3 pb-3">
        <Button 
          size="sm" 
          className="ml-auto"
          variant="outline"
          onClick={() => navigate('/dashboard/analytics')}
        >
          View Full Analytics
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BusinessAnalyticsPreview;
