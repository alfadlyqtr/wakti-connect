
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileUp, Trash2, BookOpen, Briefcase, Edit, Users, Bot, Upload, Info } from 'lucide-react';
import { AIAssistantRole } from '@/types/ai-assistant.types';
import { useToast } from '@/components/ui/use-toast';
import { useAIKnowledge } from '@/hooks/ai/useAIKnowledge';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface RoleSpecificKnowledgeProps {
  selectedRole: AIAssistantRole;
  canAccess: boolean;
}

export const RoleSpecificKnowledge: React.FC<RoleSpecificKnowledgeProps> = ({
  selectedRole,
  canAccess
}) => {
  const [activeTab, setActiveTab] = useState(selectedRole);
  const { toast } = useToast();
  const { knowledgeUploads, isLoadingKnowledge, deleteKnowledge, addKnowledge } = useAIKnowledge();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Check file type
    if (!/\.(txt|pdf|docx|md)$/i.test(file.name)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a TXT, PDF, DOCX, or MD file",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        if (!content) {
          throw new Error("Failed to read file content");
        }
        
        await addKnowledge.mutateAsync({
          title: file.name,
          content: content.slice(0, 100000), // Limit content size
          role: activeTab as AIAssistantRole,
        });
        
        toast({
          title: "Knowledge added",
          description: `${file.name} has been added to your ${getRoleName(activeTab as AIAssistantRole)} knowledge`,
        });
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error adding knowledge:", error);
      toast({
        title: "Error adding knowledge",
        description: "Failed to add knowledge. Please try again.",
        variant: "destructive",
      });
    }
    
    // Reset the file input
    e.target.value = '';
  };
  
  const handleDeleteKnowledge = async (id: string) => {
    try {
      await deleteKnowledge.mutateAsync(id);
      toast({
        title: "Knowledge deleted",
        description: "The knowledge item has been deleted",
      });
    } catch (error) {
      console.error("Error deleting knowledge:", error);
      toast({
        title: "Error deleting knowledge",
        description: "Failed to delete knowledge. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const getRoleName = (role: AIAssistantRole) => {
    switch (role) {
      case "student": return "Student";
      case "employee": return "Work";
      case "writer": return "Creator";
      case "business_owner": return "Business";
      default: return "General";
    }
  };
  
  const getRoleIcon = (role: AIAssistantRole) => {
    switch (role) {
      case "student": return <BookOpen className="h-4 w-4" />;
      case "employee": return <Users className="h-4 w-4" />;
      case "writer": return <Edit className="h-4 w-4" />;
      case "business_owner": return <Briefcase className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };
  
  const filteredKnowledge = knowledgeUploads?.filter(item => 
    item.role === activeTab || !item.role // Include items without role in all tabs
  );
  
  if (!canAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Knowledge Profile</CardTitle>
          <CardDescription>
            Knowledge profiles are only available for Business and Individual plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            Upgrade your plan to create personalized knowledge profiles for the AI.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl gap-2">
          <Info className="h-5 w-5 text-wakti-blue" />
          Knowledge Profiles
        </CardTitle>
        <CardDescription>
          Upload documents to enhance the AI's knowledge for different roles
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              <span className="hidden md:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="student" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Student</span>
            </TabsTrigger>
            <TabsTrigger value="employee" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Work</span>
            </TabsTrigger>
            <TabsTrigger value="writer" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              <span className="hidden md:inline">Creator</span>
            </TabsTrigger>
            <TabsTrigger value="business_owner" className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline">Business</span>
            </TabsTrigger>
          </TabsList>
          
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Role-specific knowledge</AlertTitle>
            <AlertDescription>
              Documents uploaded here will help the AI assistant better understand your needs in this role.
            </AlertDescription>
          </Alert>
          
          <div className="mb-4">
            <Button onClick={handleFileSelect} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Knowledge for {getRoleName(activeTab as AIAssistantRole)}
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".txt,.pdf,.docx,.md"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{getRoleName(activeTab as AIAssistantRole)} Knowledge Items</h3>
            
            {isLoadingKnowledge ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="border rounded-md p-3 flex justify-between items-center">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))
            ) : filteredKnowledge && filteredKnowledge.length > 0 ? (
              filteredKnowledge.map((item) => (
                <div key={item.id} className="border rounded-md p-3 flex justify-between items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <FileUp className="h-4 w-4 mr-2 text-wakti-blue" />
                      <span className="font-medium truncate max-w-[200px]">{item.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Added {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteKnowledge(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground border rounded-md">
                <p>No knowledge items for {getRoleName(activeTab as AIAssistantRole)} yet.</p>
                <p className="text-sm">Upload documents to enhance the AI's knowledge.</p>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
