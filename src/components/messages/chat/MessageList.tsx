
import React from "react";
import { Message } from "@/types/message.types";
import { Button } from "@/components/ui/button";
import { Reply } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  onReplyClick?: (message: Message) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, onReplyClick }) => {
  if (!messages || messages.length === 0) {
    return <div className="text-center text-muted-foreground">No messages yet.</div>;
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="rounded-xl border p-4 bg-muted shadow-sm flex items-start justify-between"
        >
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-1">
              <span className="font-medium">
                {msg.senderId === currentUserId ? "You" : msg.senderName}
              </span>{" "}
              → {msg.recipientId === currentUserId ? "You" : msg.recipientName || msg.recipientId}
            </div>
            {msg.type === "text" && <div className="text-base">{msg.content}</div>}
            {msg.type === "voice" && msg.audioUrl && (
              <audio controls className="mt-2 max-w-full">
                <source src={msg.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            {msg.type === "image" && msg.imageUrl && (
              <img
                src={msg.imageUrl}
                alt="Sent Image"
                className="mt-2 max-w-[300px] rounded-md border"
              />
            )}
            <div className="text-xs text-muted-foreground mt-2">
              {new Date(msg.createdAt).toLocaleString()}
            </div>
          </div>

          {onReplyClick && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="ml-2 mt-0 h-8 w-8 p-0" 
              onClick={() => onReplyClick(msg)}
              title="Reply"
            >
              <Reply className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
