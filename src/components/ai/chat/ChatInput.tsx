
import React from "react";
import { Button } from "@/components/ui/button";
import { PaperclipIcon, Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isDisabled: boolean;
  value: string;
  onChange: (s: string) => void;
  onClearChat?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  isDisabled,
  value,
  onChange,
  onClearChat,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (value?.trim()) {
      onSendMessage(value);
    }
  };

  return (
    <form
      className="flex gap-2 items-center w-full"
      onSubmit={handleSend}
      autoComplete="off"
    >
      <input
        type="text"
        className="flex-1 border rounded-lg px-3 py-2 bg-background/80 text-sm"
        value={value}
        onChange={handleInputChange}
        placeholder="Type your message…"
        disabled={isDisabled || isLoading}
      />
      <Button type="submit" size="icon" disabled={isDisabled || isLoading || !value.trim()}>
        <Send className="h-5 w-5" />
      </Button>
      {onClearChat && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearChat}
          className="text-xs"
        >
          Clear
        </Button>
      )}
    </form>
  );
};

export default ChatInput;
