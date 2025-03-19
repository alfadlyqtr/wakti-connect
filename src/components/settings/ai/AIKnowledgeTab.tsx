
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Upload, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AIKnowledgeUpload } from "@/types/ai-assistant.types";

interface AIKnowledgeTabProps {
  knowledgeUploads?: AIKnowledgeUpload[];
  isLoadingKnowledge: boolean;
  onAddKnowledge: (title: string, content: string) => Promise<void>;
  onDeleteKnowledge: (id: string) => Promise<void>;
  isAddingKnowledge: boolean;
}

export const AIKnowledgeTab: React.FC<AIKnowledgeTabProps> = ({
  knowledgeUploads,
  isLoadingKnowledge,
  onAddKnowledge,
  onDeleteKnowledge,
  isAddingKnowledge,
}) => {
  const [knowledgeTitle, setKnowledgeTitle] = useState("");
  const [knowledgeContent, setKnowledgeContent] = useState("");
  const [isKnowledgeDialogOpen, setIsKnowledgeDialogOpen] = useState(false);

  const handleAddKnowledge = async () => {
    if (!knowledgeTitle.trim() || !knowledgeContent.trim()) return;
    
    await onAddKnowledge(knowledgeTitle, knowledgeContent);
    
    setKnowledgeTitle("");
    setKnowledgeContent("");
    setIsKnowledgeDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Custom Knowledge</span>
          <Dialog open={isKnowledgeDialogOpen} onOpenChange={setIsKnowledgeDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Knowledge
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Knowledge</DialogTitle>
                <DialogDescription>
                  Provide information for the AI assistant to reference
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="knowledge_title">Title</Label>
                  <Input
                    id="knowledge_title"
                    placeholder="E.g., Company Policy, Team Structure"
                    value={knowledgeTitle}
                    onChange={(e) => setKnowledgeTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="knowledge_content">Content</Label>
                  <Textarea
                    id="knowledge_content"
                    placeholder="Enter the information you want the AI to know..."
                    value={knowledgeContent}
                    onChange={(e) => setKnowledgeContent(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddKnowledge}
                  disabled={isAddingKnowledge || !knowledgeTitle.trim() || !knowledgeContent.trim()}
                >
                  {isAddingKnowledge ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Add Knowledge
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Add custom knowledge for your AI assistant to reference
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingKnowledge ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-wakti-blue" />
          </div>
        ) : knowledgeUploads?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No custom knowledge added yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add information for your AI assistant to reference
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {knowledgeUploads?.map((knowledge) => (
              <div key={knowledge.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{knowledge.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteKnowledge(knowledge.id)}
                    className="h-8 w-8"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {knowledge.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Added on {new Date(knowledge.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
