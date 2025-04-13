
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface SummaryDisplayProps {
  summary: string;
  isLoading: boolean;
  onSave?: () => void;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({
  summary,
  isLoading,
  onSave
}) => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      toast({
        title: "Copied to clipboard",
        description: "Summary has been copied to your clipboard"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Meeting Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : summary ? (
          <div className="bg-muted p-3 rounded-md max-h-[250px] overflow-y-auto text-sm whitespace-pre-wrap">
            {summary}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No summary generated yet.</p>
            <p className="text-xs">Record a meeting and generate a summary to see results here.</p>
          </div>
        )}
        
        {summary && (
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              Copy
            </Button>
            {onSave && (
              <Button size="sm" onClick={onSave}>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryDisplay;
