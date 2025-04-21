
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMeetingSummaryV2 } from '@/hooks/ai/meeting-summary/useMeetingSummaryV2';
import { Play, PauseCircle, Download, FileText, Repeat } from 'lucide-react';
import MeetingPreviewDialog from './meeting-summary/MeetingPreviewDialog';

export const MeetingSummaryTool: React.FC = () => {
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  const {
    state,
    startRecording,
    stopRecording,
    generateSummary,
    resetSession,
    copySummary,
    downloadAudio,
    exportAsPDF,
    isExporting,
    isDownloadingAudio,
  } = useMeetingSummaryV2();
  
  const handlePreviewSummary = () => {
    setPreviewDialogOpen(true);
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center">
            Meeting Summary Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            {!state.isRecording && !state.summary ? (
              <Button
                onClick={startRecording}
                className="w-full flex items-center justify-center"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            ) : state.isRecording ? (
              <Button
                onClick={stopRecording}
                variant="destructive"
                className="w-full flex items-center justify-center"
                size="lg"
              >
                <PauseCircle className="mr-2 h-4 w-4" />
                Stop Recording ({Math.floor(state.recordingTime / 60)}:{(state.recordingTime % 60).toString().padStart(2, '0')})
              </Button>
            ) : null}
            
            {state.meetingParts.length > 0 && !state.summary && !state.isSummarizing && (
              <Button
                onClick={generateSummary}
                className="w-full"
                disabled={state.isRecording}
              >
                Generate Summary
              </Button>
            )}
            
            {state.isSummarizing && (
              <div className="text-center py-4">
                <div className="animate-pulse">Generating summary... Please wait</div>
              </div>
            )}
            
            {state.summary && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md max-h-60 overflow-y-auto text-sm">
                  {state.summary}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handlePreviewSummary} variant="outline" size="sm">
                    <Play className="mr-2 h-4 w-4" /> Preview
                  </Button>
                  
                  <Button onClick={copySummary} variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" /> Copy
                  </Button>
                  
                  <Button 
                    onClick={downloadAudio} 
                    variant="outline" 
                    size="sm"
                    disabled={isDownloadingAudio || !state.audioBlobs?.length}
                  >
                    <Download className="mr-2 h-4 w-4" /> 
                    {isDownloadingAudio ? 'Downloading...' : 'Download Audio'}
                  </Button>
                  
                  <Button 
                    onClick={exportAsPDF} 
                    variant="outline" 
                    size="sm"
                    disabled={isExporting}
                  >
                    <FileText className="mr-2 h-4 w-4" /> 
                    {isExporting ? 'Exporting...' : 'Export PDF'}
                  </Button>
                  
                  <Button onClick={resetSession} variant="outline" size="sm">
                    <Repeat className="mr-2 h-4 w-4" /> New Recording
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <MeetingPreviewDialog
        isOpen={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        title={state.meetingTitle || "Meeting Summary"}
        summary={state.summary || ""}
      />
    </>
  );
};

export default MeetingSummaryTool;
