
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileDown, Copy, Check, MapPin, Users, ListChecks } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SummaryDisplayProps {
  summary: string;
  detectedLocation: string | null;
  detectedAttendees?: string | null;
  detectedActionItems?: string | null;
  copied: boolean;
  copySummary: () => void;
  exportAsPDF: () => void;
  downloadAudio: () => void;
  isExporting: boolean;
  isDownloadingAudio: boolean;
  audioData: string | null;
  summaryRef: React.RefObject<HTMLDivElement>;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({
  summary,
  detectedLocation,
  detectedAttendees,
  detectedActionItems,
  copied,
  copySummary,
  exportAsPDF,
  downloadAudio,
  isExporting,
  isDownloadingAudio,
  audioData,
  summaryRef
}) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Meeting Summary</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copySummary}
            className="h-8"
          >
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsPDF}
            disabled={isExporting}
            className="h-8"
          >
            <FileDown className="h-4 w-4 mr-1" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
          
          {audioData && (
            <Button
              variant="outline"
              size="sm"
              onClick={downloadAudio}
              disabled={isDownloadingAudio}
              className="h-8"
            >
              <Download className="h-4 w-4 mr-1" />
              {isDownloadingAudio ? 'Downloading...' : 'Audio'}
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
          {detectedAttendees && <TabsTrigger value="attendees" className="text-xs">Attendees</TabsTrigger>}
          {detectedActionItems && <TabsTrigger value="actions" className="text-xs">Action Items</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="summary">
          {detectedLocation && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="h-3 w-3" />
              <span>Location: {detectedLocation}</span>
            </div>
          )}
          
          <div 
            ref={summaryRef}
            className="bg-muted/50 p-3 rounded-md text-sm whitespace-pre-wrap"
          >
            {summary}
          </div>
        </TabsContent>
        
        {detectedAttendees && (
          <TabsContent value="attendees">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              <span>Meeting Attendees</span>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-md text-sm whitespace-pre-wrap">
              {detectedAttendees}
            </div>
          </TabsContent>
        )}
        
        {detectedActionItems && (
          <TabsContent value="actions">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <ListChecks className="h-4 w-4" />
              <span>Action Items</span>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-md text-sm whitespace-pre-wrap">
              {detectedActionItems}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
};

export default SummaryDisplay;
