
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, FileDown, Download } from 'lucide-react';

interface ActionButtonsProps {
  onCopy: () => void;
  onExportPDF: () => Promise<void>;
  onDownloadAudio: () => void;
  isExporting: boolean;
  isDownloadingAudio: boolean;
  hasAudio: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCopy,
  onExportPDF,
  onDownloadAudio,
  isExporting,
  isDownloadingAudio,
  hasAudio,
}) => {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={onCopy}
        className="flex items-center gap-1"
      >
        <Copy className="h-4 w-4" />
        <span>Copy</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onExportPDF}
        disabled={isExporting}
        className="flex items-center gap-1"
      >
        <FileDown className="h-4 w-4" />
        <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
      </Button>
      
      {hasAudio && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadAudio}
          disabled={isDownloadingAudio}
          className="flex items-center gap-1 bg-blue-50 border-blue-200 hover:bg-blue-100"
        >
          <Download className="h-4 w-4" />
          <span>{isDownloadingAudio ? "Downloading..." : "Download Audio"}</span>
        </Button>
      )}
    </>
  );
};
