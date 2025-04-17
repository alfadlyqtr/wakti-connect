
import { generatePdf } from '@/utils/pdf';
import { MeetingContext } from '@/utils/text/transcriptionUtils';

// Function to export the meeting summary as PDF
export const exportMeetingSummaryAsPDF = async (
  summary: string,
  recordingTime: number,
  meetingContext: MeetingContext | null
) => {
  try {
    await generatePdf(summary, recordingTime, meetingContext);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
