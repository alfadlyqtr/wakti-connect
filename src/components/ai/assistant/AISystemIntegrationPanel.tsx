
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Calendar, User, BarChart2, CircleDollarSign, 
  BriefcaseBusiness, Brain, MessageSquare, Receipt,
  TrendingUp, Users, ShieldCheck, Settings,
  FileText, List, Clock, Presentation, Kanban,
  Building, BadgePercent, HeartHandshake, Globe,
  LineChart, Target, Megaphone, Bell, UserCog,
  Boxes, Landmark, Scale, PieChart, AreaChart
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
  
  // Business integration tools organized by tab - ensuring each tab has unique tools
  const businessTools = {
    overview: [
      { label: "Business dashboard summary", icon: BriefcaseBusiness },
      { label: "Weekly performance report", icon: LineChart },
      { label: "Monthly revenue forecast", icon: CircleDollarSign }
    ],
    staff: [
      { label: "Staff attendance report", icon: User },
      { label: "Team performance analysis", icon: Users },
      { label: "Staff scheduling optimization", icon: Calendar }
    ],
    analytics: [
      { label: "Customer engagement metrics", icon: HeartHandshake },
      { label: "Service popularity breakdown", icon: PieChart },
      { label: "Growth trend analysis", icon: TrendingUp }
    ],
    operations: [
      { label: "Project management overview", icon: Kanban },
      { label: "Resource allocation status", icon: Boxes },
      { label: "Process efficiency analysis", icon: Settings }
    ],
    marketing: [
      { label: "Campaign performance metrics", icon: Megaphone },
      { label: "Social media engagement", icon: Globe },
      { label: "Conversion rate analysis", icon: Target }
    ],
    finance: [
      { label: "Cash flow projection", icon: Landmark },
      { label: "Expense categorization", icon: AreaChart },
      { label: "Revenue stream analysis", icon: Scale }
    ]
  };
  
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-3 mb-2">
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
      </TabsList>
      
      <TabsList className="grid grid-cols-3 mb-2 mt-1">
        <TabsTrigger value="operations" className="flex items-center gap-1">
          <Settings className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Operations</span>
        </TabsTrigger>
        <TabsTrigger value="marketing" className="flex items-center gap-1">
          <Megaphone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Marketing</span>
        </TabsTrigger>
        <TabsTrigger value="finance" className="flex items-center gap-1">
          <CircleDollarSign className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Finance</span>
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
