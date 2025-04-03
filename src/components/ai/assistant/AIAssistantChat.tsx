
import React, { useEffect } from 'react';
import { AIMessage, AIAssistantRole, RoleContexts } from '@/types/ai-assistant.types';
import { AIAssistantMessage } from '../message/AIAssistantMessage';
import { Loader2, BookOpen, FileText, Calendar, CheckSquare, Upload, Camera, Mic, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTimeBasedGreeting } from '@/lib/dateUtils';

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
  // Determine if it's the first message (welcome message)
  const isFirstMessage = messages.length <= 1;
  
  // Get welcome message with time-based greeting
  const getWelcomeMessage = () => {
    const baseMessage = RoleContexts[selectedRole].welcomeMessage;
    const timeGreeting = getTimeBasedGreeting();
    
    // Extract just the greeting part (before the first comma or exclamation)
    const firstPart = baseMessage.split(/[,!]/)[0];
    const restOfMessage = baseMessage.substring(firstPart.length);
    
    // Replace the initial greeting with a time-based one
    return `${timeGreeting}${restOfMessage}`;
  };
  
  // If there are no messages (besides welcome), show role context welcome message
  if (isFirstMessage) {
    const welcomeMessage: AIMessage = {
      id: "role-welcome",
      role: "assistant",
      content: getWelcomeMessage(),
      timestamp: new Date(),
    };
    
    const getRoleSpecificTools = () => {
      switch(selectedRole) {
        case 'student':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
              </div>
              
              <StudentContentTabs setInputMessage={setInputMessage} />
            </div>
          );
        case 'professional':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
              </div>
              
              <ProfessionalContentTabs setInputMessage={setInputMessage} />
            </div>
          );
        case 'creator':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
              </div>
              
              <CreatorContentTabs setInputMessage={setInputMessage} />
            </div>
          );
        case 'business_owner':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
              </div>
              
              <BusinessContentTabs setInputMessage={setInputMessage} />
            </div>
          );
        default:
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
              </div>
              
              <GeneralContentTabs setInputMessage={setInputMessage} />
            </div>
          );
      }
    };
    
    return (
      <div className="space-y-4 w-full flex flex-col">
        <AIAssistantMessage message={welcomeMessage} />
        
        {/* Role-specific context tools */}
        <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="text-sm font-medium mb-3">Quick Tools for {selectedRole === 'professional' ? 'Work Productivity' : 
            selectedRole === 'business_owner' ? 'Business Owners' : 
            selectedRole === 'creator' ? 'Creators' : 
            selectedRole === 'student' ? 'Students' : 'You'}</h3>
            
          {getRoleSpecificTools()}
        </div>
        
        {/* Quick upload buttons */}
        <div className="flex flex-wrap gap-2 pt-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            <span>Upload File</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Camera className="h-4 w-4" />
            <span>Take Photo</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Mic className="h-4 w-4" />
            <span>Voice Message</span>
          </Button>
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

// Student content tabs
const StudentContentTabs: React.FC<{ setInputMessage: (value: string) => void }> = ({ setInputMessage }) => {
  return (
    <Tabs defaultValue="subjects" className="w-full mt-4">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="subjects">My Subjects</TabsTrigger>
        <TabsTrigger value="profile">Student Profile</TabsTrigger>
        <TabsTrigger value="tools">Study Tools</TabsTrigger>
      </TabsList>
      
      <TabsContent value="subjects" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Click to get help with your subjects:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me with Mathematics concepts: ")}>
            <span>Mathematics</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me with Physics problems: ")}>
            <span>Physics</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me understand this Biology topic: ")}>
            <span>Biology</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me with my History essay about: ")}>
            <span>History</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
        <Button variant="outline" size="sm" className="w-full mt-2">Add More Subjects</Button>
      </TabsContent>
      
      <TabsContent value="profile" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Your student profile:</div>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Education Level:</span>
            <span>University</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Major:</span>
            <span>Computer Science</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Year:</span>
            <span>Sophomore</span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full mt-3">Edit Profile</Button>
      </TabsContent>
      
      <TabsContent value="tools" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Study tools and resources:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Create flashcards for me about: ")}>
            <span>Flashcard Generator</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me prepare for my exam on: ")}>
            <span>Exam Prep</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Explain this concept in simple terms: ")}>
            <span>Concept Explainer</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me find research sources about: ")}>
            <span>Research Helper</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Professional content tabs
const ProfessionalContentTabs: React.FC<{ setInputMessage: (value: string) => void }> = ({ setInputMessage }) => {
  return (
    <Tabs defaultValue="work" className="w-full mt-4">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="work">Work Tools</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="productivity">Productivity</TabsTrigger>
      </TabsList>
      
      <TabsContent value="work" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Professional tools:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Draft a professional email about: ")}>
            <span>Email Templates</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Create a presentation outline on: ")}>
            <span>Presentation Helper</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me prepare talking points for a meeting about: ")}>
            <span>Meeting Prep</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me write a project proposal for: ")}>
            <span>Project Proposals</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="tasks" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Task management:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me prioritize these tasks: ")}>
            <span>Task Prioritization</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Create a timeboxed schedule for: ")}>
            <span>Time Blocking</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Break down this project into manageable tasks: ")}>
            <span>Project Breakdown</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me create action items from this meeting: ")}>
            <span>Action Items</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="productivity" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Productivity techniques:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me apply the Pomodoro technique to: ")}>
            <span>Pomodoro Timer</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me organize my digital files for: ")}>
            <span>Digital Organization</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Create a focus plan to avoid distractions when: ")}>
            <span>Focus Planner</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Recommend productivity strategies for: ")}>
            <span>Productivity Tips</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Creator content tabs
const CreatorContentTabs: React.FC<{ setInputMessage: (value: string) => void }> = ({ setInputMessage }) => {
  return (
    <Tabs defaultValue="content" className="w-full mt-4">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="ideas">Ideas</TabsTrigger>
        <TabsTrigger value="tools">Creator Tools</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Content creation tools:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me draft a blog post about: ")}>
            <span>Blog Writer</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Create social media captions for: ")}>
            <span>Caption Generator</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me write a script for a video about: ")}>
            <span>Video Scripts</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Suggest headline options for my article about: ")}>
            <span>Headline Creator</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="ideas" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Idea generation:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Brainstorm content ideas about: ")}>
            <span>Content Ideas</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me develop a unique angle for: ")}>
            <span>Angle Developer</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me find a creative hook for: ")}>
            <span>Hook Creator</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Generate story ideas about: ")}>
            <span>Story Generator</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="tools" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Creator tools:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me create a content calendar for: ")}>
            <span>Content Calendar</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Edit and improve this draft: ")}>
            <span>Content Editor</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Suggest keywords and hashtags for: ")}>
            <span>Keyword Finder</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me structure this article about: ")}>
            <span>Content Structure</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Business owner content tabs
const BusinessContentTabs: React.FC<{ setInputMessage: (value: string) => void }> = ({ setInputMessage }) => {
  return (
    <Tabs defaultValue="customers" className="w-full mt-4">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="customers">Customer Service</TabsTrigger>
        <TabsTrigger value="management">Management</TabsTrigger>
        <TabsTrigger value="planning">Planning</TabsTrigger>
      </TabsList>
      
      <TabsContent value="customers" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Customer communication tools:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Draft a customer response to: ")}>
            <span>Customer Responses</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Create a follow-up email for clients who: ")}>
            <span>Follow-up Templates</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Draft a service announcement about: ")}>
            <span>Service Announcements</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Create customer satisfaction survey questions for: ")}>
            <span>Feedback Surveys</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="management" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Team management:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Create a staff meeting agenda about: ")}>
            <span>Meeting Agendas</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Draft a job description for: ")}>
            <span>Job Descriptions</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Create a team update about: ")}>
            <span>Team Updates</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Draft performance review guidelines for: ")}>
            <span>Performance Reviews</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="planning" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Business planning:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me create a business plan for: ")}>
            <span>Business Plans</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Draft a marketing strategy for: ")}>
            <span>Marketing Strategy</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Create a financial projection for: ")}>
            <span>Financial Projections</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me analyze market trends for: ")}>
            <span>Market Analysis</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// General content tabs
const GeneralContentTabs: React.FC<{ setInputMessage: (value: string) => void }> = ({ setInputMessage }) => {
  return (
    <Tabs defaultValue="personal" className="w-full mt-4">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="planning">Planning</TabsTrigger>
        <TabsTrigger value="tools">Tools</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Personal assistance:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me draft a personal email about: ")}>
            <span>Email Drafting</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me prepare for an interview for: ")}>
            <span>Interview Prep</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Draft a letter regarding: ")}>
            <span>Letter Writing</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Give me advice about: ")}>
            <span>Personal Advice</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="planning" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Planning tools:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me plan my day for: ")}>
            <span>Day Planner</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Create a checklist for: ")}>
            <span>Checklist Creator</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me plan a trip to: ")}>
            <span>Trip Planner</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Create a meal plan for: ")}>
            <span>Meal Planning</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="tools" className="mt-2 p-3 border rounded-md bg-slate-50">
        <div className="text-xs text-muted-foreground mb-2">Helpful tools:</div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Summarize this text for me: ")}>
            <span>Text Summarizer</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me research information about: ")}>
            <span>Research Helper</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Translate this phrase to: ")}>
            <span>Translation Helper</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => 
            setInputMessage("Help me compare these options: ")}>
            <span>Decision Helper</span>
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};
