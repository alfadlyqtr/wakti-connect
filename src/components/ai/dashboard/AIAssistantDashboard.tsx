
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Lightbulb, FileText, History, Settings, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAISettings } from "@/components/settings/ai/context/AISettingsContext";
import { useNavigate } from "react-router-dom";

export const AIAssistantDashboard: React.FC = () => {
  const { settings } = useAISettings();
  const navigate = useNavigate();
  
  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Get personalized mode name if available
  const getModeName = () => {
    if (!settings?.assistant_mode) return "Personal Assistant";
    
    switch (settings.assistant_mode) {
      case "tutor": return "Tutor Mode";
      case "content_creator": return "Content Creator";
      case "project_manager": return "Project Manager";
      case "business_manager": return "Business Manager";
      case "personal_assistant": return "Personal Assistant";
      default: return "Personal Assistant";
    }
  };
  
  const quickActions = [
    { 
      title: "Create a task summary", 
      prompt: "Summarize my upcoming tasks and suggest a schedule for today",
      icon: <Clock className="h-4 w-4" />
    },
    { 
      title: "Help with an email", 
      prompt: "Help me draft a professional email about...",
      icon: <FileText className="h-4 w-4" />
    },
    { 
      title: "Daily productivity tip", 
      prompt: "Share a productivity tip for more efficient task management",
      icon: <Lightbulb className="h-4 w-4" />
    }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl flex items-center gap-2">
            <span>{getGreeting()}</span>
            {settings?.user_role && (
              <span className="text-base font-normal text-muted-foreground">
                | {settings.user_role.replace('_', ' ')}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Your AI assistant is ready to help with your productivity needs in <span className="font-medium text-wakti-blue">{getModeName()}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate("/dashboard/ai-assistant/chat")}
            className="w-full"
            size="lg"
          >
            <Bot className="mr-2 h-5 w-5" />
            Start a New Conversation
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Common tasks your AI assistant can help with
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action, i) => (
              <Button 
                key={i} 
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 mb-2"
                onClick={() => {
                  navigate("/dashboard/ai-assistant/chat", { 
                    state: { initialPrompt: action.prompt } 
                  });
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="h-8 w-8 rounded-full bg-wakti-blue/10 flex items-center justify-center flex-shrink-0">
                    {action.icon}
                  </div>
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">{action.prompt}</p>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-wakti-blue" />
                Documents & Knowledge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Upload documents to enhance your AI assistant
                  </p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/dashboard/ai-assistant/documents")}
                  size="sm"
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-wakti-blue" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    View your conversation history
                  </p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/dashboard/ai-assistant/history")}
                  size="sm"
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-wakti-blue" />
                AI Assistant Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/dashboard/ai-assistant/settings")}
                variant="outline"
                className="w-full"
              >
                Customize Your AI Experience
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
