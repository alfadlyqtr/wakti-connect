
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Calendar, CheckSquare, User, BarChart2, CircleDollarSign, 
  BriefcaseBusiness, Brain, Clock, MessageSquare, 
  Users, Briefcase, FileText, Receipt
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
  // Get business-specific commands
  const getBusinessCommands = () => {
    const relevantCommands = { ...SystemCommands };
    
    // Filter out system-only commands
    Object.keys(relevantCommands).forEach(key => {
      if (relevantCommands[key].systemOnly) {
        delete relevantCommands[key];
      }
    });
    
    return relevantCommands;
  };
  
  const businessCommands = getBusinessCommands();
  
  return (
    <Card className="border-wakti-blue/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Brain className="h-6 w-6 text-wakti-blue" />
          WAKTI Business Integration
        </CardTitle>
        <CardDescription className="text-base">
          Your AI assistant can interact with WAKTI systems to help manage your business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="business" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="business" className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <span>Business</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Staff</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-1">
              <CheckSquare className="h-4 w-4" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Business Tab */}
          <TabsContent value="business" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Business Operations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BriefcaseBusiness className="h-5 w-5 mr-2 text-wakti-blue" />
                      Business Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Manage your business information and settings</p>
                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick("Check my business information")}
                        >
                          <BriefcaseBusiness className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Check my business information</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick("Update my business hours")}
                        >
                          <Clock className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Update my business hours</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-wakti-blue" />
                      Bookings & Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Manage your services and booking options</p>
                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick(businessCommands.view_bookings?.examples[0] || "Show my bookings")}
                        >
                          <Calendar className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">View upcoming bookings</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick("Check my available services")}
                        >
                          <CircleDollarSign className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Check my available services</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Staff Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Users className="h-5 w-5 mr-2 text-wakti-blue" />
                      Staff Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Monitor and manage your staff</p>
                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick(businessCommands.manage_staff?.examples[0] || "Show my staff status")}
                        >
                          <User className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Show staff status</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick("Assign tasks to staff")}
                        >
                          <CheckSquare className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Assign tasks to staff</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Receipt className="h-5 w-5 mr-2 text-wakti-blue" />
                      Staff Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Review staff performance and reports</p>
                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick("Check staff working hours")}
                        >
                          <Clock className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Check staff working hours</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick("Get staff earnings report")}
                        >
                          <CircleDollarSign className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Get staff earnings report</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Task Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <CheckSquare className="h-5 w-5 mr-2 text-wakti-blue" />
                      Business Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Manage business-related tasks</p>
                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick(businessCommands.create_task?.examples[0] || "Create a task")}
                        >
                          <CheckSquare className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Create a business task</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick(businessCommands.view_tasks?.examples[0] || "View my tasks")}
                        >
                          <FileText className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">View my tasks</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-wakti-blue" />
                      Schedules & Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Manage business schedules and deadlines</p>
                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick(businessCommands.schedule_event?.examples[0] || "Schedule a meeting")}
                        >
                          <Calendar className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Schedule a business meeting</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick(businessCommands.check_calendar?.examples[0] || "Check my calendar")}
                        >
                          <Clock className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Check my business calendar</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Business Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BarChart2 className="h-5 w-5 mr-2 text-wakti-blue" />
                      Performance Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">View business performance data</p>
                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick(businessCommands.view_analytics?.examples[0] || "Show my analytics")}
                        >
                          <BarChart2 className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Show business analytics</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick(businessCommands.get_business_overview?.examples[0] || "Business overview")}
                        >
                          <BriefcaseBusiness className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Get business overview</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Users className="h-5 w-5 mr-2 text-wakti-blue" />
                      Customer Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Review customer data and interactions</p>
                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick("Show my subscriber statistics")}
                        >
                          <Users className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Show subscriber statistics</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start h-auto py-2"
                          onClick={() => onExampleClick("Analyze customer feedback")}
                        >
                          <MessageSquare className="h-4 w-4 mr-2 text-wakti-blue" />
                          <span className="text-sm">Analyze customer feedback</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
