
import React from "react";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import { Image as ImageIcon } from "lucide-react";

interface MessageContentProps {
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export function MessageContent({ content, timestamp, isUser }: MessageContentProps) {
  // Check if this is an image message (Markdown format: ![alt](url))
  const isImageMessage = content.match(/!\[.*?\]\(.*?\)/);

  // Extract the image URL if this is an image message
  let imageUrl = null;
  let imageAlt = "";
  if (isImageMessage) {
    const match = content.match(/!\[(.*?)\]\((.*?)\)/);
    if (match) {
      imageAlt = match[1] || "Generated image";
      imageUrl = match[2];
    }
  }

  return (
    <div
      className={cn(
        "rounded-lg p-2 sm:p-3 text-xs sm:text-sm max-w-[75%] sm:max-w-md break-words overflow-hidden shadow-sm transition-all",
        isUser 
          ? "bg-wakti-blue text-white animate-slide-in-right" 
          : "bg-muted animate-fade-in border border-muted"
      )}
      style={{ animationDuration: "0.3s" }}
    >
      {imageUrl ? (
        <div className="space-y-2">
          <div className="relative aspect-square max-w-sm rounded-md overflow-hidden">
            <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block relative">
              <img
                src={imageUrl}
                alt={imageAlt}
                className="object-cover w-full h-full rounded-md hover:opacity-95 transition-opacity"
                onError={(e) => {
                  // Show fallback on error
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'flex items-center justify-center bg-gray-100 w-full h-full rounded-md';
                    fallback.innerHTML = `<div class="text-center p-4">
                      <div class="flex justify-center"><svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
                      <p class="mt-2 text-sm text-gray-500">Failed to load image</p>
                    </div>`;
                    parent.appendChild(fallback);
                  }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 transition-opacity">
                <div className="bg-black/70 text-white text-xs rounded-full px-2 py-1">
                  View full image
                </div>
              </div>
            </a>
          </div>
          {imageAlt && imageAlt !== "Generated image" && (
            <p className="text-xs opacity-80 italic mt-1">{imageAlt}</p>
          )}
        </div>
      ) : (
        <div className="prose prose-xs sm:prose-sm max-w-none dark:prose-invert overflow-auto max-h-[400px] thin-scrollbar">
          <Markdown>{content}</Markdown>
        </div>
      )}
      <div className={cn(
        "text-[8px] sm:text-[10px] mt-1 text-right",
        isUser ? "text-blue-100" : "text-muted-foreground"
      )}>
        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
