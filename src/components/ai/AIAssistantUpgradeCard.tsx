
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AIAssistantUpgradeCardProps {
  compact?: boolean;
}

export const AIAssistantUpgradeCard: React.FC<AIAssistantUpgradeCardProps> = ({ 
  compact = false 
}) => {
  const navigate = useNavigate();
  
  // If we're in compact mode, show a simplified version
  if (compact) {
    return (
      <Card className="border-dashed border-2 w-full mb-4">
        <CardContent className="p-4">
          <div className="text-center">
            <Zap className="h-5 w-5 mx-auto text-amber-500 mb-2" />
            <p className="text-sm font-medium mb-2">Upgrade to unlock AI Assistant</p>
            <Button 
              size="sm" 
              variant="default" 
              className="bg-amber-500 hover:bg-amber-600 text-xs"
              onClick={() => navigate('/dashboard/settings?tab=billing')}
            >
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Full version
  return (
    <Card className="border-dashed border-2 w-full max-w-3xl mx-auto">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="h-5 w-5 text-amber-500" />
          WAKTI AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-amber-50 rounded-full p-4 sm:p-6">
            <Zap className="h-8 w-8 sm:h-12 sm:w-12 text-amber-500" />
          </div>
          
          <h3 className="text-lg sm:text-xl font-bold">Upgrade to access the AI Assistant</h3>
          
          <p className="text-muted-foreground max-w-lg text-sm sm:text-base">
            WAKTI's AI Assistant helps boost your productivity with intelligent task management, appointment scheduling, and business insights. Available with Individual and Business plans.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="flex items-start gap-2">
              <div className="rounded-full bg-green-100 p-1 mt-0.5">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Smart Task Management</p>
                <p className="text-xs text-muted-foreground">Prioritizes and organizes your tasks</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="rounded-full bg-green-100 p-1 mt-0.5">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Business Analytics</p>
                <p className="text-xs text-muted-foreground">Provides insights to grow your business</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="rounded-full bg-green-100 p-1 mt-0.5">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Draft Messages</p>
                <p className="text-xs text-muted-foreground">Creates professional communications</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="rounded-full bg-green-100 p-1 mt-0.5">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Booking Assistance</p>
                <p className="text-xs text-muted-foreground">Helps manage your calendar efficiently</p>
              </div>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-amber-500 hover:bg-amber-600 mt-2"
            onClick={() => navigate('/dashboard/settings?tab=billing')}
          >
            Upgrade Now
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Plans start at QAR 20/month
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
