
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Lock, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIAssistantUpgradeCardProps {
  compact?: boolean;
}

export const AIAssistantUpgradeCard: React.FC<AIAssistantUpgradeCardProps> = ({ 
  compact = false 
}) => {
  if (compact) {
    return (
      <Card className="shadow-md border-wakti-blue/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-wakti-blue/10 rounded-full flex items-center justify-center">
              <Lock className="h-4 w-4 text-wakti-blue" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold">Upgrade to Access WAKTI AI</h4>
              <p className="text-xs text-muted-foreground">
                Available on Individual & Business plans
              </p>
            </div>
            <Button size="sm" className="h-8 px-3 bg-wakti-blue hover:bg-wakti-blue/90">
              Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-wakti-blue/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-wakti-blue" />
          WAKTI AI Assistant
        </CardTitle>
        <CardDescription>
          Unlock the full power of your intelligent assistant
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="bg-wakti-blue/5 p-4 rounded-lg border border-wakti-blue/10">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-amber-500" />
              Available on Premium Plans
            </h3>
            <p className="text-sm text-muted-foreground">
              WAKTI AI Assistant is available on Individual (QAR 20/month) and Business (QAR 45/month) plans.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-1">Individual Plan</h4>
              <ul className="text-xs space-y-1">
                <li className="flex items-start gap-1.5">
                  <span className="text-green-500">✓</span>
                  <span>Access to all AI modes</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-green-500">✓</span>
                  <span>Task & reminder creation</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-green-500">✓</span>
                  <span>Voice, file & camera input</span>
                </li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-3">
              <h4 className="text-sm font-medium mb-1">Business Plan</h4>
              <ul className="text-xs space-y-1">
                <li className="flex items-start gap-1.5">
                  <span className="text-green-500">✓</span>
                  <span>All Individual features</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-green-500">✓</span>
                  <span>Business analytics insights</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-green-500">✓</span>
                  <span>Staff & service management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full bg-wakti-blue hover:bg-wakti-blue/90">
          Upgrade Now
        </Button>
      </CardFooter>
    </Card>
  );
};
