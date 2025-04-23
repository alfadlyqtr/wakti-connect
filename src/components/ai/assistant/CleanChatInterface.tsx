import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Loader2, Paperclip, X, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { useChat } from 'ai/react';
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { EnhancedToolsTab } from "@/components/ai/tools/EnhancedToolsTab";
import { useSubscription } from "@/hooks/useSubscription";
import { useDebounce } from "@/hooks/useDebounce";
import { useAICredits } from "@/hooks/useAICredits";
import { useAIChat } from "@/hooks/useAIChat";
import { useAIChatContext } from "@/contexts/AIChatContext";
import { useTasks } from "@/hooks/tasks";

interface CleanChatInterfaceProps {
  selectedRole: AIAssistantRole;
}

const CleanChatInterface: React.FC<CleanChatInterfaceProps> = ({ selectedRole }) => {
  const [input, setInput] = useState('');
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isToolsTabOpen, setIsToolsTabOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const { isPro } = useSubscription();
  const { addCredits } = useAICredits();
  const { addChat } = useAIChat();
  const { setChats } = useAIChatContext();
  const { createTask } = useTasks();

  const {
    messages,
    input: chatInput,
    setInput: setChatInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: '/api/ai/chat',
    initialMessages: [],
    onFinish: (message) => {
      if (message.role === 'assistant') {
        addCredits(-1);
      }
    },
  });

  const debouncedInput = useDebounce(input, 500);

  useEffect(() => {
    setChatInput(debouncedInput);
  }, [debouncedInput, setChatInput]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const canAccessEnhancedTools = isPro;

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

  const handleUseContent = (content: string) => {
    setInput(content);
    setIsToolsTabOpen(false);
  };

  const handleCreateTask = async () => {
    setIsCreatingTask(true);
    try {
      const lines = input.split('\n');
      const title = lines[0].replace(/^#\s*/, '');
      const description = lines.slice(1).join('\n');

      // Extract date and time from the input using regex
      const dateTimeRegex = /(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2})/;
      const dateTimeMatch = input.match(dateTimeRegex);

      let due_date = null;
      let due_time = null;

      if (dateTimeMatch) {
        due_date = dateTimeMatch[1];
        due_time = dateTimeMatch[2];
      } else {
        // If no date and time are found, extract only the date
        const dateRegex = /(\d{4}-\d{2}-\d{2})/;
        const dateMatch = input.match(dateRegex);
        if (dateMatch) {
          due_date = dateMatch[1];
        }
      }

      if (!title) {
        toast({
          title: "Error",
          description: "Please provide a title for the task.",
          variant: "destructive",
        });
        return;
      }

      const taskData = { title, description, due_date, due_time, priority: "normal" };

      await createTask(taskData);

      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      setInput('');
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create task.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleSubmitWrapper = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to send messages.",
        variant: "destructive",
      });
      return;
    }

    if (isLoadingCredits) {
      toast({
        title: "Please wait",
        description: "We are checking your credits...",
      });
      return;
    }

    if (messages.length === 0) {
      setIsLoadingCredits(true);
      try {
        await addChat(selectedRole.id);
        const updatedChats = await setChats();
        if (!updatedChats || updatedChats.length === 0) {
          toast({
            title: "No credits",
            description: "You don't have enough credits to start a new chat. Please upgrade your plan.",
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to start new chat.",
          variant: "destructive",
        });
        return;
      } finally {
        setIsLoadingCredits(false);
      }
    }

    handleSubmit(e);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="text-sm text-muted-foreground">
                {message.role === 'user' ? 'You' : selectedRole.name}
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

      {isToolsTabOpen ? (
        <div className="border-t p-4">
          <EnhancedToolsTab
            selectedRole={selectedRole}
            onUseContent={handleUseContent}
            canAccess={canAccessEnhancedTools}
          />
          <Button variant="secondary" onClick={() => setIsToolsTabOpen(false)} className="mt-4 w-full">
            Close Tools
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmitWrapper} className="border-t p-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow"
            />
            <Button type="button" variant="secondary" onClick={() => setIsToolsTabOpen(true)}>
              <Paperclip className="h-4 w-4 mr-2" />
              Tools
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Send
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCreateTask}
              disabled={isCreatingTask}
            >
              {isCreatingTask ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
              Create Task
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CleanChatInterface;
