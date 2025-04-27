
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2, FileText, AlertTriangle } from "lucide-react";
import { useAISettings } from './context/AISettingsContext';
import { AIKnowledgeUpload } from '@/components/ai/personality-switcher/types';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';

export function AIKnowledgeTab() {
  const { knowledgeUploads, uploadKnowledge, deleteKnowledge, isUploading, uploadError } = useAISettings();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Set default title from filename without extension
      if (!title) {
        const fileName = selectedFile.name.split('.')[0];
        setTitle(fileName);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file || !title.trim()) return;
    await uploadKnowledge(file, title);
    setFile(null);
    setTitle("");
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await deleteKnowledge(id);
    }
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return <FileText className="text-red-500" />;
      case 'doc':
      case 'docx': return <FileText className="text-blue-500" />;
      case 'txt': return <FileText className="text-gray-500" />;
      default: return <FileText className="text-primary" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Knowledge Base</h3>
      <p className="text-sm text-muted-foreground">
        Upload documents to enhance your AI assistant's knowledge.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload PDF, Word, or text files to improve AI responses.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="file-upload">Upload File</Label>
              <div className="border rounded-md p-2">
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center py-4 border-2 border-dashed rounded-md">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">
                      {file ? file.name : "Click to browse files"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      PDF, Word, or text files up to 10MB
                    </span>
                  </div>
                </Label>
              </div>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <p className="text-sm">Uploading...</p>
                <Progress value={70} />
              </div>
            )}
            
            {uploadError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {uploadError.message || "Failed to upload file."}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="role-select">Apply to AI Role</Label>
              <Select defaultValue="general">
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Assistant</SelectItem>
                  <SelectItem value="business">Business Assistant</SelectItem>
                  <SelectItem value="writer">Writing Assistant</SelectItem>
                  <SelectItem value="student">Student Assistant</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The AI role that will utilize this knowledge.
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={!file || !title.trim() || isUploading}
          >
            Upload Document
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            Manage your AI knowledge base documents.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {knowledgeUploads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No documents uploaded yet.
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {knowledgeUploads.map((doc: AIKnowledgeUpload) => (
                  <div 
                    key={doc.id} 
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center">
                      {getFileIcon(doc.type || 'txt')}
                      
                      <div className="ml-3">
                        <p className="font-medium text-sm">
                          {doc.title || doc.name || 'Untitled Document'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.role || 'General'} • {
                            doc.created_at ? 
                            format(new Date(doc.created_at), 'MMM d, yyyy') : 
                            'Unknown date'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
        
        <CardFooter className="justify-between items-center border-t px-6 py-3">
          <p className="text-sm text-muted-foreground">
            {knowledgeUploads.length} document{knowledgeUploads.length !== 1 ? 's' : ''}
          </p>
          
          {knowledgeUploads.length > 0 && (
            <Button variant="outline" size="sm">
              Manage All
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
