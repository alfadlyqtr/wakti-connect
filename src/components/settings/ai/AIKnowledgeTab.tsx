
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
import { useTranslation } from "react-i18next";

export const AIKnowledgeTab: React.FC = () => {
  const { t } = useTranslation();
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
        <CardTitle>{t("aiSettings.knowledge.title")}</CardTitle>
        <CardDescription>
          {t("aiSettings.knowledge.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="knowledge_title">{t("aiSettings.knowledge.titleLabel")}</Label>
            <Input
              id="knowledge_title"
              placeholder={t("aiSettings.knowledge.titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="knowledge_role">{t("aiSettings.knowledge.roleSpecific")}</Label>
            <Select
              value={selectedRole}
              onValueChange={(value: AIAssistantRole | undefined) => setSelectedRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("aiSettings.knowledge.selectRole")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">{t("aiSettings.roles.general")}</SelectItem>
                <SelectItem value="student">{t("aiSettings.roles.student")}</SelectItem>
                <SelectItem value="business_owner">{t("aiSettings.roles.business")}</SelectItem>
                <SelectItem value="employee">{t("aiSettings.roles.work")}</SelectItem>
                <SelectItem value="writer">{t("aiSettings.roles.creative")}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t("aiSettings.knowledge.roleDescription")}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="knowledge_content">{t("aiSettings.knowledge.content")}</Label>
            <Textarea
              id="knowledge_content"
              placeholder={t("aiSettings.knowledge.contentPlaceholder")}
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
                {t("aiSettings.knowledge.adding")}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {t("aiSettings.knowledge.add")}
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
            <h3 className="font-medium">{t("aiSettings.knowledge.yourKnowledge")}</h3>
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
                            {t(`aiSettings.roles.${item.role}`, {
                              defaultValue: t("aiSettings.roles.general")
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("aiSettings.knowledge.added", {
                          date: new Date(item.created_at).toLocaleDateString()
                        })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteKnowledge(item.id)}
                    title={t("aiSettings.knowledge.delete")}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t("aiSettings.knowledge.noItems")}</p>
            <p className="text-sm">
              {t("aiSettings.knowledge.addInfo")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
