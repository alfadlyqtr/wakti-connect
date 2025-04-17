import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, FileDown, FileText, MapPin, User, Users } from 'lucide-react';
import { formatDuration } from '@/utils/text/transcriptionUtils';
import { Badge } from '@/components/ui/badge';
import { MeetingContext } from '@/utils/text/transcriptionUtils';

interface SummaryDisplayProps {
  summary: string;
  detectedLocation?: string | null;
  recordingTime: number;
  copied: boolean;
  isExporting: boolean;
  isDownloadingAudio: boolean;
  audioData: Blob | null;
  summaryRef: React.RefObject<HTMLDivElement>;
  copySummary: (summary: string) => void;
  exportAsPDF: () => void;
  downloadAudio: () => void;
  meetingContext?: MeetingContext | null;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({
  summary,
  detectedLocation,
  recordingTime,
  copied,
  isExporting,
  isDownloadingAudio,
  audioData,
  summaryRef,
  copySummary,
  exportAsPDF,
  downloadAudio,
  meetingContext
}) => {
  // Process summary to convert markdown to HTML
  const formattedSummary = summary
    .replace(/^## (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/- (.*?)(?:\n|$)/g, '<li>$1</li>')
    .replace(/<li>/g, '<ul class="list-disc pl-5 my-2"><li>')
    .replace(/<\/li>(?!\n<li>)/g, '</li></ul>')
    .replace(/<\/li>\n<li>/g, '</li><li>');

  // Determine if we have any context to display
  const hasContext = meetingContext?.location || 
                    (meetingContext?.participants && meetingContext.participants.length > 0) || 
                    meetingContext?.host || 
                    detectedLocation;

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">Meeting Summary</span>
          <Badge variant="outline" className="ml-auto">
            {formatDuration(recordingTime)}
          </Badge>
        </CardTitle>
      </CardHeader>

      {/* Context information display */}
      {hasContext && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 border-b border-blue-100 dark:border-blue-800/50">
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-blue-800 dark:text-blue-200">
            {(meetingContext?.location || detectedLocation) && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{meetingContext?.location || detectedLocation}</span>
              </div>
            )}
            
            {meetingContext?.participants && meetingContext.participants.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{Array.isArray(meetingContext.participants) 
                  ? meetingContext.participants.join(", ") 
                  : meetingContext.participants}</span>
              </div>
            )}
            
            {meetingContext?.host && (
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>Host: {meetingContext.host}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <CardContent className="p-0">
        <ScrollArea className="h-[300px] sm:h-[400px] w-full">
          <div 
            ref={summaryRef} 
            className="p-4 space-y-3 text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: formattedSummary }}
          />
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs sm:text-sm flex items-center gap-1" 
            onClick={() => copySummary(summary)}
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs sm:text-sm flex items-center gap-1"
            onClick={exportAsPDF}
            disabled={isExporting}
          >
            <FileText className="h-3.5 w-3.5" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
        
        {audioData && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs sm:text-sm flex items-center gap-1"
            onClick={downloadAudio}
            disabled={isDownloadingAudio}
          >
            <Download className="h-3.5 w-3.5" />
            {isDownloadingAudio ? 'Downloading...' : 'Download Audio'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SummaryDisplay;
