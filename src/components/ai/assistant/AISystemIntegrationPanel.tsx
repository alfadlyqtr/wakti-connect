
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Calendar, CheckSquare, User, BarChart2, CircleDollarSign, 
  BriefcaseBusiness, Brain, Clock, MessageSquare
} from 'lucide-react';
import { SystemCommands, AIAssistantRole } from '@/types/ai-assistant.types';

interface AISystemIntegrationPanelProps {
  selectedRole: AIAssistantRole;
  onExampleClick: (example: string) => void;
}

export const AISystemIntegrationPanel: React.FC<AISystemIntegrationPanelProps> = ({
  selectedRole,
  onExampleClick
}) => {
  // Filter commands based on user role to show most relevant ones first
  const getFilteredCommands = () => {
    const relevantCommands = { ...SystemCommands };
    
    // Filter out system-only commands
    Object.keys(relevantCommands).forEach(key => {
      if (relevantCommands[key].systemOnly) {
        delete relevantCommands[key];
      }
    });
    
    // Sort commands based on role relevance
    let commandKeys = Object.keys(relevantCommands);
    
    if (selectedRole === 'business_owner') {
      // Prioritize business-related commands
      commandKeys = [
        'manage_staff',
        'view_analytics',
        'view_bookings',
        'check_business',
        ...commandKeys.filter(k => !['manage_staff', 'view_analytics', 'view_bookings', 'check_business'].includes(k))
      ];
    }
    
    // Create sorted object
    const sortedCommands: typeof relevantCommands = {};
    commandKeys.forEach(key => {
      sortedCommands[key] = relevantCommands[key];
    });
    
    return sortedCommands;
  };
  
  const filteredCommands = getFilteredCommands();
  
  return (
    <Tabs defaultValue="business" className="w-full">
      <TabsList className="grid grid-cols-4 mb-2">
        <TabsTrigger value="business" className="flex items-center gap-1">
          <BriefcaseBusiness className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Business</span>
        </TabsTrigger>
        <TabsTrigger value="staff" className="flex items-center gap-1">
          <User className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Staff</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-1">
          <BarChart2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="bookings" className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Bookings</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="business" className="mt-0">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start h-auto py-1.5 px-2 text-xs"
              onClick={() => onExampleClick("Check my business overview")}
            >
              <BriefcaseBusiness className="h-3 w-3 mr-1 text-wakti-blue" />
              <span>Check my business overview</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start h-auto py-1.5 px-2 text-xs"
              onClick={() => onExampleClick("How is my business performing?")}
            >
              <CircleDollarSign className="h-3 w-3 mr-1 text-wakti-blue" />
              <span>How is my business performing?</span>
            </Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="staff" className="mt-0">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {filteredCommands.manage_staff?.examples.slice(0, 2).map((example, i) => (
              <Button 
                key={i} 
                variant="outline" 
                size="sm" 
                className="justify-start h-auto py-1.5 px-2 text-xs"
                onClick={() => onExampleClick(example)}
              >
                <User className="h-3 w-3 mr-1 text-wakti-blue" />
                <span>{example}</span>
              </Button>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="analytics" className="mt-0">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {filteredCommands.view_analytics?.examples.slice(0, 2).map((example, i) => (
              <Button 
                key={i} 
                variant="outline" 
                size="sm" 
                className="justify-start h-auto py-1.5 px-2 text-xs"
                onClick={() => onExampleClick(example)}
              >
                <BarChart2 className="h-3 w-3 mr-1 text-wakti-blue" />
                <span>{example}</span>
              </Button>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="bookings" className="mt-0">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {filteredCommands.view_bookings?.examples.slice(0, 2).map((example, i) => (
              <Button 
                key={i} 
                variant="outline" 
                size="sm" 
                className="justify-start h-auto py-1.5 px-2 text-xs"
                onClick={() => onExampleClick(example)}
              >
                <Calendar className="h-3 w-3 mr-1 text-wakti-blue" />
                <span>{example}</span>
              </Button>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
