
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Calendar, User, BarChart2, CircleDollarSign, 
  BriefcaseBusiness, Brain, MessageSquare, Receipt,
  TrendingUp, Users, ShieldCheck, Settings
} from 'lucide-react';
import { AIAssistantRole } from '@/types/ai-assistant.types';

interface AISystemIntegrationPanelProps {
  selectedRole: AIAssistantRole;
  onExampleClick: (example: string) => void;
}

export const AISystemIntegrationPanel: React.FC<AISystemIntegrationPanelProps> = ({
  selectedRole,
  onExampleClick
}) => {
  // Only show the business integration panel for business_owner role
  if (selectedRole !== 'business_owner') {
    return null;
  }
  
  // Business integration tools organized by tab
  const businessTools = {
    overview: [
      { label: "Business overview summary", icon: BriefcaseBusiness },
      { label: "Financial performance report", icon: CircleDollarSign }
    ],
    staff: [
      { label: "Staff attendance report", icon: User },
      { label: "Assign tasks to team members", icon: Users }
    ],
    analytics: [
      { label: "Customer engagement analysis", icon: TrendingUp },
      { label: "Revenue forecast for Q2", icon: BarChart2 }
    ],
    operations: [
      { label: "Upcoming appointments", icon: Calendar },
      { label: "Review pending invoices", icon: Receipt }
    ]
  };
  
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-4 mb-2">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <BriefcaseBusiness className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="staff" className="flex items-center gap-1">
          <User className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Staff</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-1">
          <BarChart2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="operations" className="flex items-center gap-1">
          <Settings className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Operations</span>
        </TabsTrigger>
      </TabsList>
      
      {Object.entries(businessTools).map(([tab, tools]) => (
        <TabsContent key={tab} value={tab} className="mt-0">
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {tools.map((tool, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  size="sm" 
                  className="justify-start h-auto py-1.5 px-2 text-xs"
                  onClick={() => onExampleClick(tool.label)}
                >
                  <tool.icon className="h-3 w-3 mr-1 text-wakti-blue" />
                  <span>{tool.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
