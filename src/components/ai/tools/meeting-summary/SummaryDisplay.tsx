
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, Check, Download, FileDown, Map } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { generateMapEmbedUrl, generateGoogleMapsUrl } from '@/config/maps';

interface SummaryDisplayProps {
  summary: string;
  detectedLocation: string | null;
  copied: boolean;
  copySummary: () => void;
  exportAsPDF: () => Promise<void>;
  downloadAudio: () => void;
  isExporting: boolean;
  isDownloadingAudio: boolean;
  audioData: Blob | null;
  summaryRef: React.RefObject<HTMLDivElement>;
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
  summaryRef
}) => {
  const mapRef = useRef<HTMLIFrameElement>(null);

  if (!summary) {
    return null;
  }

  return (
    <Card className="p-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Meeting Summary</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copySummary}
            className="flex items-center space-x-1"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsPDF}
            disabled={isExporting}
            className="flex items-center space-x-1"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </Button>
          
          {audioData && (
            <Button
              variant="outline"
              size="sm"
              onClick={downloadAudio}
              disabled={isDownloadingAudio}
              className="flex items-center space-x-1"
            >
              <FileDown className="h-4 w-4" />
              <span>Download Audio</span>
            </Button>
          )}
        </div>
      </div>
      
      <div
        ref={summaryRef}
        className="prose max-w-none dark:prose-invert mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md"
        dangerouslySetInnerHTML={{
          __html: summary
            .replace(/\n/g, "<br />")
            .replace(/^## (.*)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
            .replace(/^### (.*)/gm, '<h3 class="text-lg font-semibold mt-3 mb-1">$1</h3>')
            .replace(/^\- (.*)/gm, '<li>$1</li>')
            .replace(/^\* (.*)/gm, '<li>$1</li>')
        }}
      />
      
      {detectedLocation && (
        <div className="mt-4 border rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium flex items-center">
              <Map className="h-4 w-4 mr-2" />
              Detected Meeting Location
            </h4>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                window.open(generateGoogleMapsUrl(detectedLocation), '_blank');
              }}
            >
              Open in Google Maps
            </Button>
          </div>
          
          <iframe
            ref={mapRef}
            width="100%"
            height="200"
            style={{ border: 0 }}
            loading="lazy"
            src={generateMapEmbedUrl(detectedLocation)}
            title="Meeting Location"
            className="rounded-md"
          />
        </div>
      )}
    </Card>
  );
};

export default SummaryDisplay;
