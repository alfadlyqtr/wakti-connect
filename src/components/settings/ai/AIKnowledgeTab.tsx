
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, File, Trash2 } from "lucide-react";
import { useAISettings } from "./context/AISettingsContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIAssistantRole } from "@/types/ai-assistant.types";

export const AIKnowledgeTab: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedRole, setSelectedRole] = useState<AIAssistantRole | undefined>(undefined);
  const { 
    knowledgeUploads, 
    addKnowledge, 
    deleteKnowledge, 
    isAddingKnowledge, 
    isLoadingKnowledge 
  } = useAISettings();
  
  const handleAddKnowledge = async () => {
    if (!title.trim() || !content.trim()) return;
    
    try {
      await addKnowledge(title, content, selectedRole);
      setTitle("");
      setContent("");
      setSelectedRole(undefined);
    } catch (error) {
      console.error("Failed to add knowledge:", error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <CardDescription>
          Add custom information that your AI assistant can reference
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="knowledge_title">Title</Label>
            <Input
              id="knowledge_title"
              placeholder="E.g., Company Policies, Product Information"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="knowledge_role">Role Specific (Optional)</Label>
            <Select
              value={selectedRole}
              onValueChange={(value: AIAssistantRole | undefined) => setSelectedRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a specific assistant role (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Assistant</SelectItem>
                <SelectItem value="student">Student Assistant</SelectItem>
                <SelectItem value="business_owner">Business Assistant</SelectItem>
                <SelectItem value="employee">Work Assistant</SelectItem>
                <SelectItem value="writer">Creative Assistant</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              If selected, this knowledge will only be used when that assistant role is active.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="knowledge_content">Content</Label>
            <Textarea
              id="knowledge_content"
              placeholder="Enter text that you want your AI assistant to know about"
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleAddKnowledge}
            disabled={isAddingKnowledge || !title.trim() || !content.trim()}
            className="w-full"
          >
            {isAddingKnowledge ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Knowledge...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Add to Knowledge Base
              </>
            )}
          </Button>
        </div>
        
        {isLoadingKnowledge ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : knowledgeUploads && knowledgeUploads.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-medium">Your Knowledge Base</h3>
            <div className="space-y-2">
              {knowledgeUploads.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium text-sm">{item.title}</p>
                        {item.role && (
                          <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            {item.role === "student" ? "Student" : 
                             item.role === "business_owner" ? "Business" :
                             item.role === "employee" ? "Work" : 
                             item.role === "writer" ? "Creator" : "General"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Added {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteKnowledge(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No knowledge items added yet</p>
            <p className="text-sm">
              Add information that your AI assistant can use when responding
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
