
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    } else if (selectedRole === 'student') {
      // Prioritize task and scheduling commands
      commandKeys = [
        'create_task',
        'view_tasks',
        'schedule_event',
        'check_calendar',
        ...commandKeys.filter(k => !['create_task', 'view_tasks', 'schedule_event', 'check_calendar'].includes(k))
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
    <Card className="mt-6 border-wakti-blue/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center gap-2">
          <Brain className="h-5 w-5 text-wakti-blue" />
          WAKTI System Integration
        </CardTitle>
        <CardDescription>
          I can interact with WAKTI's systems to help you with:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="tasks" className="flex items-center gap-1">
              <CheckSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-1">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Business</span>
            </TabsTrigger>
            <TabsTrigger value="more" className="flex items-center gap-1">
              <BarChart2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">More</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="mt-0">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                I can help manage your tasks and to-dos:
              </p>
              
              <div className="grid grid-cols-1 gap-2">
                {filteredCommands.create_task?.examples.slice(0, 1).map((example, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => onExampleClick(example)}
                  >
                    <CheckSquare className="h-3.5 w-3.5 mr-2 text-wakti-blue" />
                    <span className="text-sm">{example}</span>
                  </Button>
                ))}
                
                {filteredCommands.view_tasks?.examples.slice(0, 1).map((example, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => onExampleClick(example)}
                  >
                    <Clock className="h-3.5 w-3.5 mr-2 text-wakti-blue" />
                    <span className="text-sm">{example}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-0">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                I can help manage your events and schedule:
              </p>
              
              <div className="grid grid-cols-1 gap-2">
                {filteredCommands.schedule_event?.examples.slice(0, 1).map((example, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => onExampleClick(example)}
                  >
                    <Calendar className="h-3.5 w-3.5 mr-2 text-wakti-blue" />
                    <span className="text-sm">{example}</span>
                  </Button>
                ))}
                
                {filteredCommands.check_calendar?.examples.slice(0, 1).map((example, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => onExampleClick(example)}
                  >
                    <Clock className="h-3.5 w-3.5 mr-2 text-wakti-blue" />
                    <span className="text-sm">{example}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="business" className="mt-0">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                I can help with business management:
              </p>
              
              <div className="grid grid-cols-1 gap-2">
                {filteredCommands.manage_staff?.examples.slice(0, 1).map((example, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => onExampleClick(example)}
                  >
                    <User className="h-3.5 w-3.5 mr-2 text-wakti-blue" />
                    <span className="text-sm">{example}</span>
                  </Button>
                ))}
                
                {filteredCommands.view_analytics?.examples.slice(0, 1).map((example, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => onExampleClick(example)}
                  >
                    <BarChart2 className="h-3.5 w-3.5 mr-2 text-wakti-blue" />
                    <span className="text-sm">{example}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="more" className="mt-0">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                Additional capabilities:
              </p>
              
              <div className="grid grid-cols-1 gap-2">
                {filteredCommands.search_contacts?.examples.slice(0, 1).map((example, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => onExampleClick(example)}
                  >
                    <User className="h-3.5 w-3.5 mr-2 text-wakti-blue" />
                    <span className="text-sm">{example}</span>
                  </Button>
                ))}
                
                {filteredCommands.view_bookings?.examples.slice(0, 1).map((example, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => onExampleClick(example)}
                  >
                    <CircleDollarSign className="h-3.5 w-3.5 mr-2 text-wakti-blue" />
                    <span className="text-sm">{example}</span>
                  </Button>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => onExampleClick("Help me with my productivity")}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-2 text-wakti-blue" />
                  <span className="text-sm">Help me with my productivity</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
