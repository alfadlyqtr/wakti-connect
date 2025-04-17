
import { exportMeetingSummary } from '@/utils/pdf/pdfExportUtils';

// Function to export the meeting summary as PDF
export const exportMeetingSummaryAsPDF = async (
  summary: string,
  recordingTime: number,
  detectedLocation: string | null
) => {
  try {
    await exportMeetingSummary(summary, recordingTime, detectedLocation);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
