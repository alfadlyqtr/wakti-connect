
import { generatePdf } from '@/utils/pdf';

// Function to export the meeting summary as PDF
export const exportMeetingSummaryAsPDF = async (
  summary: string,
  recordingTime: number,
  detectedLocation: string | null
) => {
  try {
    await generatePdf(summary, recordingTime, detectedLocation);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
