
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Sparkles, BookOpen, Zap } from 'lucide-react';
import { UnifiedChatInterfaceWithProvider } from '@/components/ai/chat/UnifiedChatInterface';

const DashboardAIAssistant = () => {
  return (
    <div className="container max-w-5xl mx-auto p-4 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">WAKTI AI Assistant</h1>
        <p className="text-muted-foreground">
          Your intelligent assistant for managing tasks, scheduling, and more
        </p>
      </div>
      
      <UnifiedChatInterfaceWithProvider />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4" />
              About WAKTI AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              WAKTI AI is an intelligent assistant designed to help you manage tasks, 
              create reminders, assist with learning, generate creative content, and more.
              Choose from different modes tailored to your specific needs.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">AI Assistant Modes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-wakti-blue h-5 w-5 mt-0.5 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">General Chat:</span> General help, questions, app walkthroughs
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-purple-600 h-5 w-5 mt-0.5 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Productivity:</span> Manage tasks, reminders, and performance
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-600 h-5 w-5 mt-0.5 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Student:</span> Assist with homework and learning
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full h-5 w-5 mt-0.5 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Creative:</span> Brainstorming, content creation, and visual ideas
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAIAssistant;
