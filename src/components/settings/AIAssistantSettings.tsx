
import React, { useState } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bot, Save, Loader2, Plus, Upload, Trash } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AIAssistantSettings = () => {
  const { 
    aiSettings, 
    isLoadingSettings, 
    updateSettings, 
    canUseAI,
    addKnowledge,
    knowledgeUploads,
    isLoadingKnowledge,
    deleteKnowledge
  } = useAIAssistant();
  
  const [newSettings, setNewSettings] = useState(aiSettings);
  const [knowledgeTitle, setKnowledgeTitle] = useState("");
  const [knowledgeContent, setKnowledgeContent] = useState("");
  const [isKnowledgeDialogOpen, setIsKnowledgeDialogOpen] = useState(false);
  
  React.useEffect(() => {
    if (aiSettings) {
      setNewSettings(aiSettings);
    }
  }, [aiSettings]);
  
  const handleSaveSettings = async () => {
    if (!newSettings) return;
    await updateSettings.mutateAsync(newSettings);
  };
  
  const handleAddKnowledge = async () => {
    if (!knowledgeTitle.trim() || !knowledgeContent.trim()) return;
    
    await addKnowledge.mutateAsync({
      title: knowledgeTitle,
      content: knowledgeContent
    });
    
    setKnowledgeTitle("");
    setKnowledgeContent("");
    setIsKnowledgeDialogOpen(false);
  };
  
  const handleDeleteKnowledge = async (id: string) => {
    await deleteKnowledge.mutateAsync(id);
  };
  
  if (!canUseAI) {
    return <AIAssistantUpgradeCard />;
  }
  
  if (isLoadingSettings || !newSettings) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
      </div>
    );
  }
  
  return (
    <Tabs defaultValue="personality">
      <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
        <TabsTrigger value="personality">Personality</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personality">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-wakti-blue" />
              AI Personality Settings
            </CardTitle>
            <CardDescription>
              Customize how your AI assistant interacts with you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="assistant_name">Assistant Name</Label>
              <Input 
                id="assistant_name" 
                value={newSettings.assistant_name}
                onChange={(e) => setNewSettings({...newSettings, assistant_name: e.target.value})}
                placeholder="WAKTI"
              />
            </div>
            
            <div className="space-y-2">
              <Label>AI Tone</Label>
              <RadioGroup 
                value={newSettings.tone} 
                onValueChange={(value: "formal" | "casual" | "concise" | "detailed" | "balanced") => 
                  setNewSettings({...newSettings, tone: value})
                }
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="formal" id="formal" />
                  <Label htmlFor="formal" className="cursor-pointer">Formal & Professional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="casual" id="casual" />
                  <Label htmlFor="casual" className="cursor-pointer">Casual & Friendly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="concise" id="concise" />
                  <Label htmlFor="concise" className="cursor-pointer">Concise & Direct</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="detailed" id="detailed" />
                  <Label htmlFor="detailed" className="cursor-pointer">Detailed & Informative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="balanced" id="balanced" />
                  <Label htmlFor="balanced" className="cursor-pointer">Balanced</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Response Length</Label>
              <RadioGroup 
                value={newSettings.response_length} 
                onValueChange={(value: "short" | "balanced" | "detailed") => 
                  setNewSettings({...newSettings, response_length: value})
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short" className="cursor-pointer">Short & Quick Responses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="balanced" id="balanced_length" />
                  <Label htmlFor="balanced_length" className="cursor-pointer">Balanced Responses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="detailed" id="detailed_length" />
                  <Label htmlFor="detailed_length" className="cursor-pointer">In-Depth Responses</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveSettings}
              disabled={updateSettings.isPending}
              className="w-full"
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Personality Settings
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="features">
        <Card>
          <CardHeader>
            <CardTitle>AI Features & Behavior</CardTitle>
            <CardDescription>
              Control how the AI assistant behaves and what features it uses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="proactiveness">AI Proactiveness</Label>
                <p className="text-sm text-muted-foreground">
                  Allow AI to suggest actions based on your activity
                </p>
              </div>
              <Switch
                id="proactiveness"
                checked={newSettings.proactiveness}
                onCheckedChange={(checked) => 
                  setNewSettings({...newSettings, proactiveness: checked})
                }
              />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label>Suggestion Frequency</Label>
              <p className="text-sm text-muted-foreground">
                How often should the AI offer suggestions and ideas
              </p>
              <RadioGroup 
                value={newSettings.suggestion_frequency} 
                onValueChange={(value: "low" | "medium" | "high") => 
                  setNewSettings({...newSettings, suggestion_frequency: value})
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low_freq" />
                  <Label htmlFor="low_freq" className="cursor-pointer">Low - Minimal suggestions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium_freq" />
                  <Label htmlFor="medium_freq" className="cursor-pointer">Medium - Balanced suggestions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high_freq" />
                  <Label htmlFor="high_freq" className="cursor-pointer">High - Frequent suggestions</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label>Enabled Features</Label>
              <p className="text-sm text-muted-foreground">
                Select which features the AI assistant can help with
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tasks_feature" className="cursor-pointer">Task Management</Label>
                  <Switch
                    id="tasks_feature"
                    checked={newSettings.enabled_features.tasks}
                    onCheckedChange={(checked) => 
                      setNewSettings({
                        ...newSettings, 
                        enabled_features: {
                          ...newSettings.enabled_features,
                          tasks: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="events_feature" className="cursor-pointer">Event Planning</Label>
                  <Switch
                    id="events_feature"
                    checked={newSettings.enabled_features.events}
                    onCheckedChange={(checked) => 
                      setNewSettings({
                        ...newSettings, 
                        enabled_features: {
                          ...newSettings.enabled_features,
                          events: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="staff_feature" className="cursor-pointer">Staff Management</Label>
                  <Switch
                    id="staff_feature"
                    checked={newSettings.enabled_features.staff}
                    onCheckedChange={(checked) => 
                      setNewSettings({
                        ...newSettings, 
                        enabled_features: {
                          ...newSettings.enabled_features,
                          staff: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics_feature" className="cursor-pointer">Analytics & Insights</Label>
                  <Switch
                    id="analytics_feature"
                    checked={newSettings.enabled_features.analytics}
                    onCheckedChange={(checked) => 
                      setNewSettings({
                        ...newSettings, 
                        enabled_features: {
                          ...newSettings.enabled_features,
                          analytics: checked
                        }
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="messaging_feature" className="cursor-pointer">Messaging Assistance</Label>
                  <Switch
                    id="messaging_feature"
                    checked={newSettings.enabled_features.messaging}
                    onCheckedChange={(checked) => 
                      setNewSettings({
                        ...newSettings, 
                        enabled_features: {
                          ...newSettings.enabled_features,
                          messaging: checked
                        }
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveSettings}
              disabled={updateSettings.isPending}
              className="w-full"
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Feature Settings
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="knowledge">
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
                      disabled={addKnowledge.isPending || !knowledgeTitle.trim() || !knowledgeContent.trim()}
                    >
                      {addKnowledge.isPending ? (
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
                        onClick={() => handleDeleteKnowledge(knowledge.id)}
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
      </TabsContent>
    </Tabs>
  );
};
