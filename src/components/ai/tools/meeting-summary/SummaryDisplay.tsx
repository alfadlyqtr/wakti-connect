
import React from 'react';
import { motion } from 'framer-motion';
import { Map, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummaryDisplayProps {
  summary: string;
  detectedLocation: string | null;
  detectedAttendees: string[] | null;
  copied: boolean;
  copySummary: () => void;
  exportAsPDF: () => Promise<void>;
  downloadAudio: () => void;
  isExporting: boolean;
  isDownloadingAudio: boolean;
  audioData: Blob[] | null;
  summaryRef: React.RefObject<HTMLDivElement>;
  onReset?: () => void;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({
  summary,
  detectedLocation,
  detectedAttendees,
  copied,
  copySummary,
  exportAsPDF,
  downloadAudio,
  isExporting,
  isDownloadingAudio,
  audioData,
  summaryRef,
  onReset
}) => {
  if (!summary) {
    return null;
  }

  // Function to generate Google Maps URL
  const generateGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  return (
    <div className="p-4">
      <div
        ref={summaryRef}
        className="prose max-w-none dark:prose-invert mb-6"
        dangerouslySetInnerHTML={{
          __html: summary
            .replace(/\n/g, "<br />")
            .replace(/^## (.*)/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-blue-700">$1</h2>')
            .replace(/^### (.*)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-blue-600">$1</h3>')
            .replace(/^\- (.*)/gm, '<li class="my-1">$1</li>')
            .replace(/^\* (.*)/gm, '<li class="my-1">$1</li>')
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {detectedAttendees && detectedAttendees.length > 0 && (
          <motion.div 
            className="bg-blue-50 rounded-lg p-4 border border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium text-blue-700">Detected Attendees</h4>
            </div>
            <ul className="space-y-1 text-sm text-gray-700">
              {detectedAttendees.map((attendee, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-blue-400 rounded-full"></span>
                  {attendee}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
        
        {detectedLocation && (
          <motion.div 
            className="bg-green-50 rounded-lg p-4 border border-green-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-green-500" />
                <h4 className="font-medium text-green-700">Detected Location</h4>
              </div>
              <Button
                variant="link"
                size="sm"
                className="text-green-600 p-0 h-auto"
                onClick={() => window.open(generateGoogleMapsUrl(detectedLocation), '_blank')}
              >
                View on Map
              </Button>
            </div>
            <p className="text-sm bg-white p-2 rounded border border-green-100">
              {detectedLocation}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SummaryDisplay;
