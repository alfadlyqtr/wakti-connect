
import React from "react";
import { Message } from "@/types/message.types";
import { Button } from "@/components/ui/button";

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
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              {msg.senderId === currentUserId ? "You" : msg.senderName} → {msg.recipientId === currentUserId ? "You" : msg.recipientId}
            </div>
            {msg.type === "text" && <div className="text-base font-medium">{msg.content}</div>}
            {msg.type === "voice" && msg.audioUrl && (
              <audio controls className="mt-2">
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
          </div>

          {onReplyClick && (
            <Button size="sm" className="ml-4 mt-2" onClick={() => onReplyClick(msg)}>
              Reply
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
