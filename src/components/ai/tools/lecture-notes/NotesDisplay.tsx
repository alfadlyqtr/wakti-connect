
import React, { RefObject } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Copy, Download, FileText, Loader2, Book, FileUp } from 'lucide-react';
import { LectureNotesExportContext } from './LectureNotesExporter';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';

interface NotesDisplayProps {
  notes: string;
  detectedCourse: string | null;
  copied: boolean;
  copyNotes: (notes: string) => void;
  exportAsPDF: () => Promise<void>;
  downloadAudio: (lectureId?: string) => Promise<void>;
  isExporting: boolean;
  isDownloadingAudio: boolean;
  audioData: Blob | null;
  notesRef: RefObject<HTMLDivElement>;
  recordingTime: number;
  lectureContext: LectureNotesExportContext | null;
}

const NotesDisplay: React.FC<NotesDisplayProps> = ({
  notes,
  detectedCourse,
  copied,
  copyNotes,
  exportAsPDF,
  downloadAudio,
  isExporting,
  isDownloadingAudio,
  audioData,
  notesRef,
  recordingTime,
  lectureContext
}) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Book className="h-4 w-4 mr-2 text-green-500" />
            <h3 className="text-sm font-medium">Lecture Notes</h3>
            
            {detectedCourse && (
              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40">
                {detectedCourse}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyNotes(notes)}
              className="h-8"
            >
              {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportAsPDF}
              disabled={isExporting}
              className="h-8"
            >
              {isExporting ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <FileUp className="h-3.5 w-3.5 mr-1.5" />
              )}
              Export PDF
            </Button>
            
            {audioData && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAudio()}
                disabled={isDownloadingAudio}
                className="h-8"
              >
                {isDownloadingAudio ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                )}
                Audio
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="notes">
          <TabsList className="mb-2 h-8">
            <TabsTrigger value="notes" className="text-xs h-7">
              <Book className="h-3 w-3 mr-1" />
              Notes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes" className="mt-0">
            <div 
              ref={notesRef}
              className="prose prose-sm max-w-none dark:prose-invert"
            >
              <ScrollArea className="h-[300px] bg-gray-50 dark:bg-gray-900/50 rounded-md p-3">
                <ReactMarkdown>{notes}</ReactMarkdown>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotesDisplay;
