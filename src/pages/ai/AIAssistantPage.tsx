
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

const AIAssistantPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Bot className="mr-2 h-6 w-6" />
        WAKTI AI Assistant
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The AI Assistant feature is coming soon. This will help you manage tasks, events, and provide business insights.</p>
          <p className="text-muted-foreground mt-2">Stay tuned for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantPage;
