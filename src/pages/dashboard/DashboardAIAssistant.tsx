
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { AIAssistantUpgradeCard } from '@/components/ai/AIAssistantUpgradeCard';
import { AIAssistantHistoryCard } from '@/components/ai/AIAssistantHistoryCard';
import { AIAssistantChat } from '@/components/ai/assistant/AIAssistantChat';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { useAIAssistant } from '@/hooks/useAIAssistant';

export default function DashboardAIAssistant() {
  const navigate = useNavigate();
  const { aiSettings, isLoadingSettings, settingsError, canUseAI } = useAIAssistant();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const newMessages = [
      ...messages,
      {
        role: 'user',
        content: message,
        timestamp: new Date()
      }
    ];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);
    
    // Mock AI response after a short delay
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'This is a mock AI response. The AI assistant feature is coming soon!',
          timestamp: new Date()
        }
      ]);
      setIsLoading(false);
    }, 1500);
  };
  
  const clearMessages = () => {
    setMessages([]);
  };
  
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">AI Assistant</h2>
          <p className="text-muted-foreground">Chat with your personal AI assistant</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => navigate('/dashboard/settings?tab=ai')}
        >
          <Settings className="h-4 w-4" />
          Configure
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AIAssistantChat
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            canAccess={canUseAI}
            clearMessages={clearMessages}
          />
        </div>
        <div className="space-y-6">
          <AIAssistantHistoryCard canAccess={canUseAI} />
        </div>
      </div>
    </DashboardShell>
  );
}
