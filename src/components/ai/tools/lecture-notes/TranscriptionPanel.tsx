
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, MessageSquare, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface TranscriptionPanelProps {
  transcribedText: string;
  isSummarizing: boolean;
  generateSummary: () => Promise<void>;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcribedText,
  isSummarizing,
  generateSummary
}) => {
  if (!transcribedText) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-500" />
            <h3 className="text-sm font-medium">Transcribed Text</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-gray-100 text-xs">
              {transcribedText.length} characters
            </Badge>
            
            <Button 
              onClick={generateSummary} 
              size="sm" 
              disabled={isSummarizing || transcribedText.length < 50}
              className="h-8"
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Generate Notes
                </>
              )}
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="transcript">
          <TabsList className="mb-2 h-8">
            <TabsTrigger value="transcript" className="text-xs h-7">
              <FileText className="h-3 w-3 mr-1" />
              Transcript
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transcript" className="mt-0">
            <ScrollArea className="h-[150px] bg-gray-50 dark:bg-gray-900/50 rounded-md p-3 text-sm">
              {transcribedText || "No transcribed text yet"}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TranscriptionPanel;
