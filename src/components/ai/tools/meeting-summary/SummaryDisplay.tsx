
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, Check, Download, FileDown, Map } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY, generateGoogleMapsUrl } from '@/config/maps';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const mapRef = useRef<HTMLIFrameElement>(null);
  const [mapUrl, setMapUrl] = useState<string>('');
  
  // States for button feedback
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [exportFeedback, setExportFeedback] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);

  useEffect(() => {
    if (detectedLocation) {
      try {
        const encodedLocation = encodeURIComponent(detectedLocation);
        setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedLocation}`);
      } catch (error) {
        console.error('Error generating map URL:', error);
      }
    }
  }, [detectedLocation]);
  
  // Handle copy feedback
  useEffect(() => {
    if (copied) {
      setCopyFeedback(true);
      const timer = setTimeout(() => setCopyFeedback(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  // Custom wrapper for export with feedback
  const handleExport = async () => {
    await exportAsPDF();
    setExportFeedback(true);
    setTimeout(() => setExportFeedback(false), 2000);
  };
  
  // Custom wrapper for download with feedback
  const handleDownload = () => {
    downloadAudio();
    setDownloadFeedback(true);
    setTimeout(() => setDownloadFeedback(false), 2000);
  };

  if (!summary) {
    return null;
  }

  return (
    <Card className="p-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">{t('summary.meetingSummary')}</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copySummary}
            disabled={copyFeedback}
            className="flex items-center space-x-1 min-w-[120px]"
          >
            {copyFeedback ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span>{copyFeedback ? t('common.copied') : t('summary.copySummary')}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting || exportFeedback}
            className="flex items-center space-x-1 min-w-[120px]"
          >
            <Download className={`h-4 w-4 ${exportFeedback ? 'text-green-500' : ''}`} />
            <span>{exportFeedback ? t('summary.exported') : t('summary.exportPDF')}</span>
          </Button>
          
          {audioData && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloadingAudio || downloadFeedback}
              className="flex items-center space-x-1 min-w-[140px]"
            >
              <FileDown className={`h-4 w-4 ${downloadFeedback ? 'text-green-500' : ''}`} />
              <span>{downloadFeedback ? t('summary.downloaded') : t('summary.downloadAudio')}</span>
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
              {t('summary.detectedLocation')}
            </h4>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                window.open(generateGoogleMapsUrl(detectedLocation), '_blank');
              }}
            >
              {t('summary.openInGoogleMaps')}
            </Button>
          </div>
          
          {mapUrl && (
            <iframe
              ref={mapRef}
              width="100%"
              height="200"
              style={{ border: 0 }}
              loading="lazy"
              src={mapUrl}
              title={t('summary.meetingLocation')}
              className="rounded-md"
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default SummaryDisplay;
