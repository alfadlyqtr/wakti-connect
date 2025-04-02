
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AIDocumentManager } from "./AIDocumentManager";

export const AIDocumentLibrary: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Intelligence</CardTitle>
        <CardDescription>Manage documents that your AI assistant can reference during conversations</CardDescription>
      </CardHeader>
      <CardContent>
        <AIDocumentManager />
      </CardContent>
    </Card>
  );
};
