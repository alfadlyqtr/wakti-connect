
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Loader2, Plus, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AIAssistantRole {
  id?: string;
  name?: string;
  description?: string;
}

interface CleanChatInterfaceProps {
  selectedRole: AIAssistantRole;
}

const CleanChatInterface: React.FC<CleanChatInterfaceProps> = ({ selectedRole }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, role: string, content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // This is a placeholder implementation to avoid AI module dependencies
  const handleCreateTask = async () => {
    try {
      toast({
        title: "Task Feature",
        description: "The create task feature is not connected in this simple component.",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process request.",
        variant: "destructive",
      });
    }
  };

  const handleCopyClick = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a placeholder response from ${selectedRole?.name || "AI"}. The AI chat functionality requires additional modules.`
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="text-sm text-muted-foreground">
                {message.role === 'user' ? 'You' : (selectedRole?.name || "AI")}
              </div>
              <Card className="w-full">
                <CardContent className="prose prose-sm sm:prose-base">
                  <p>{message.content}</p>
                </CardContent>
              </Card>
              {message.role === 'assistant' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="self-end -mt-2 hover:bg-secondary/50"
                  onClick={() => handleCopyClick(message.content)}
                  disabled={isCopied}
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Send
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCreateTask}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CleanChatInterface;
