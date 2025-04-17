
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileDown, Copy, Check, MapPin, Clock } from 'lucide-react';
import { formatDuration } from '@/utils/text/transcriptionUtils';

interface SummaryDisplayProps {
  summary: string;
  detectedLocation: string | null;
  copied: boolean;
  copySummary: () => void;
  exportAsPDF: () => void;
  downloadAudio: () => void;
  isExporting: boolean;
  isDownloadingAudio: boolean;
  audioData: string | null;
  summaryRef: React.RefObject<HTMLDivElement>;
  recordingTime: number;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({
  summary,
  detectedLocation,
  copied,
  copySummary,
  exportAsPDF,
  downloadAudio,
  isExporting,
  isDownloadingAudio,
  audioData,
  summaryRef,
  recordingTime
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
      
      <div className="flex flex-wrap gap-2 mb-3">
        {detectedLocation && (
          <div className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 rounded-full px-2 py-1">
            <MapPin className="h-3 w-3" />
            <span>{detectedLocation}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 rounded-full px-2 py-1">
          <Clock className="h-3 w-3" />
          <span>Duration: {formatDuration(recordingTime)}</span>
        </div>
      </div>
      
      <div 
        ref={summaryRef}
        className="bg-muted/50 p-3 rounded-md text-sm whitespace-pre-wrap"
      >
        {summary}
      </div>
    </Card>
  );
};

export default SummaryDisplay;
