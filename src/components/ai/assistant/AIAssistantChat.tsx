
import React from 'react';
import { AIMessage, AIAssistantRole, RoleContexts } from '@/types/ai-assistant.types';
import { AIAssistantMessage } from '../message/AIAssistantMessage';
import { Loader2, BookOpen, FileText, Calendar, CheckSquare } from 'lucide-react';

export interface AIAssistantChatProps {
  messages: AIMessage[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  canAccess: boolean;
  selectedRole: AIAssistantRole;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ 
  messages, 
  isLoading,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  canAccess,
  selectedRole
}) => {
  // If there are no messages (besides welcome), show role context welcome message
  if (messages.length <= 1) {
    const welcomeMessage: AIMessage = {
      id: "role-welcome",
      role: "assistant",
      content: RoleContexts[selectedRole].welcomeMessage,
      timestamp: new Date(),
    };
    
    return (
      <div className="space-y-4 w-full flex flex-col">
        <AIAssistantMessage message={welcomeMessage} />
        
        {/* Role-specific context tools */}
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium mb-3">Quick Tools for {selectedRole === 'professional' ? 'Professionals' : 
            selectedRole === 'business_owner' ? 'Business Owners' : 
            selectedRole === 'creator' ? 'Creators' : 
            selectedRole === 'student' ? 'Students' : 'You'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {selectedRole === 'student' && (
              <>
                <button onClick={() => setInputMessage("Help me understand this subject: ")} 
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <BookOpen className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Learn Subject</span>
                </button>
                <button onClick={() => setInputMessage("Help me create a study plan for: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <Calendar className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Study Plan</span>
                </button>
                <button onClick={() => setInputMessage("Help me with my assignment on: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <FileText className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Assignment Help</span>
                </button>
                <button onClick={() => setInputMessage("Quiz me on this topic: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <CheckSquare className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Quiz Me</span>
                </button>
              </>
            )}
            
            {selectedRole === 'professional' && (
              <>
                <button onClick={() => setInputMessage("Draft an email about: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <FileText className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Draft Email</span>
                </button>
                <button onClick={() => setInputMessage("Create a meeting agenda for: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <Calendar className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Meeting Agenda</span>
                </button>
                <button onClick={() => setInputMessage("Help me prioritize these tasks: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <CheckSquare className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Prioritize Tasks</span>
                </button>
                <button onClick={() => setInputMessage("Summarize this for me: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <BookOpen className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Summarize</span>
                </button>
              </>
            )}
            
            {selectedRole === 'creator' && (
              <>
                <button onClick={() => setInputMessage("Help me brainstorm ideas for: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <BookOpen className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Brainstorm</span>
                </button>
                <button onClick={() => setInputMessage("Help me draft content about: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <FileText className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Draft Content</span>
                </button>
                <button onClick={() => setInputMessage("Create a content calendar for: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <Calendar className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Content Calendar</span>
                </button>
                <button onClick={() => setInputMessage("Edit and improve this: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <CheckSquare className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Edit & Improve</span>
                </button>
              </>
            )}
            
            {selectedRole === 'business_owner' && (
              <>
                <button onClick={() => setInputMessage("Help me with customer service response for: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <FileText className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Customer Service</span>
                </button>
                <button onClick={() => setInputMessage("Draft a business plan for: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <BookOpen className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Business Plan</span>
                </button>
                <button onClick={() => setInputMessage("Create a marketing strategy for: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <Calendar className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Marketing Strategy</span>
                </button>
                <button onClick={() => setInputMessage("Help me manage my team for: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <CheckSquare className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Team Management</span>
                </button>
              </>
            )}
            
            {selectedRole === 'general' && (
              <>
                <button onClick={() => setInputMessage("Help me plan: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <Calendar className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Plan Something</span>
                </button>
                <button onClick={() => setInputMessage("Help me draft: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <FileText className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Draft Something</span>
                </button>
                <button onClick={() => setInputMessage("Find information about: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <BookOpen className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Find Information</span>
                </button>
                <button onClick={() => setInputMessage("Create a checklist for: ")}
                  className="flex flex-col items-center p-3 rounded-lg border hover:bg-wakti-blue/5 hover:border-wakti-blue/30 transition-all">
                  <CheckSquare className="h-5 w-5 mb-2 text-wakti-blue" />
                  <span className="text-xs text-center">Create Checklist</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 w-full flex flex-col">
      {messages.map((message) => (
        <AIAssistantMessage key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-wakti-blue flex items-center justify-center flex-shrink-0">
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          </div>
          <div className="p-3 bg-muted rounded-lg max-w-[80%]">
            <p className="text-sm text-muted-foreground">Thinking...</p>
          </div>
        </div>
      )}
    </div>
  );
};
