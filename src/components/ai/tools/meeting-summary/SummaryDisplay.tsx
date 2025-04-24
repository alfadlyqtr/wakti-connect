
import React from 'react';
import { motion } from 'framer-motion';
import { Map, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateGoogleMapsUrl, GOOGLE_MAPS_API_KEY } from '@/config/maps';

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

  // Extract title from summary if present
  const extractTitle = () => {
    const titleMatch = summary.match(/Meeting Title:\s*([^\n]+)/i) || 
                      summary.match(/Title:\s*([^\n]+)/i) ||
                      summary.match(/^# ([^\n]+)/m) ||
                      summary.match(/^## ([^\n]+)/m);
    return titleMatch ? titleMatch[1].trim() : null;
  };

  const meetingTitle = extractTitle();

  // Get a thumbnail map URL for the location
  const getMapThumbnailUrl = (location: string): string => {
    const encodedLocation = encodeURIComponent(location);
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation}&zoom=14&size=400x200&key=${GOOGLE_MAPS_API_KEY}&markers=${encodedLocation}`;
  };

  return (
    <div className="p-4">
      {meetingTitle && (
        <motion.h1 
          className="text-xl sm:text-2xl font-bold text-blue-800 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {meetingTitle}
        </motion.h1>
      )}
      
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
                <li key={index} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
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
                className="text-green-600 p-0 h-auto flex items-center gap-1"
                onClick={() => window.open(generateGoogleMapsUrl(detectedLocation), '_blank')}
              >
                <span>View on Map</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm mb-3 bg-white p-2 rounded border border-green-100">
              {detectedLocation}
            </p>
            
            {/* Map thumbnail */}
            <div className="overflow-hidden rounded-md border border-green-200">
              <img 
                src={getMapThumbnailUrl(detectedLocation)} 
                alt="Location Map" 
                className="w-full h-[120px] object-cover hover:scale-105 transition-transform duration-300"
                onClick={() => window.open(generateGoogleMapsUrl(detectedLocation), '_blank')}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SummaryDisplay;
