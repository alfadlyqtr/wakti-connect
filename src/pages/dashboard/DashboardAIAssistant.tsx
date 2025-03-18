
import React, { useState, useRef, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Bot, Clock, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { AIAssistantMessage } from "@/components/ai/message";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DashboardAIAssistant = () => {
  const { user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    canUseAI, 
    clearMessages 
  } = useAIAssistant();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !canUseAI) return;
    
    await sendMessage.mutateAsync(inputMessage);
    setInputMessage("");
  };

  const suggestionQuestions = [
    "What tasks should I prioritize today?",
    "Help me plan an event for next week",
    "Analyze my team's performance",
    "Optimize my work schedule",
    "Suggest ways to improve task completion rate"
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">WAKTI AI Assistant</h1>
          <Bot className="h-6 w-6 text-wakti-blue" />
        </div>
        <p className="text-muted-foreground">
          Your AI-powered productivity assistant
        </p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6 space-y-4">
          {!canUseAI ? (
            <AIAssistantUpgradeCard />
          ) : (
            <Card className="border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-wakti-blue" />
                  Chat with WAKTI AI
                </CardTitle>
                <CardDescription>
                  Ask about tasks, events, staff management, analytics, and more
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-t border-b h-[400px] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <AIAssistantMessage
                        key={message.id}
                        message={message}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      disabled={isLoading || !canUseAI}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !canUseAI || !inputMessage.trim()}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span className="sr-only">Send</span>
                    </Button>
                  </form>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col pt-6">
                <div className="flex justify-between w-full mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearMessages}
                    className="text-xs"
                  >
                    <RefreshCcw className="h-3 w-3 mr-1" />
                    New conversation
                  </Button>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Powered by <a 
                      href="https://tmw.qa/ai-chat-bot/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-wakti-blue hover:underline ml-1"
                    >
                      TMW AI
                    </a>
                  </div>
                </div>
                
                <Alert className="bg-muted/50">
                  <AlertTitle className="text-sm font-medium">Try asking:</AlertTitle>
                  <AlertDescription className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {suggestionQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setInputMessage(question);
                          }}
                          disabled={isLoading}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chat History</CardTitle>
              <CardDescription>View your previous conversations with the AI assistant</CardDescription>
            </CardHeader>
            <CardContent>
              {canUseAI ? (
                <p className="text-center text-muted-foreground py-8">
                  Chat history feature coming soon
                </p>
              ) : (
                <AIAssistantUpgradeCard />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAIAssistant;
