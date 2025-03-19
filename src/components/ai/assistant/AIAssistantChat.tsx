
import React, { useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIMessage } from "@/types/ai-assistant.types";
import { AIAssistantMessage } from "@/components/ai/message";

interface AIAssistantChatProps {
  messages: AIMessage[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
}

export const AIAssistantChat = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
}: AIAssistantChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="border-t border-b h-[350px] sm:h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-4">
            <p className="text-sm text-muted-foreground">
              Start a conversation with WAKTI AI by typing a message below
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <AIAssistantMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-2 sm:p-4 border-t flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading || !canAccess}
          className="flex-1 text-sm"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !canAccess || !inputMessage.trim()}
          className="px-2 sm:px-3"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
};
