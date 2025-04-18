/**
 * Utility functions for exporting meeting summaries
 */

import { formatTime } from '@/utils/audio/audioProcessing';
import html2pdf from 'html2pdf.js';

interface MeetingSummaryPDFOptions {
  title?: string;
  companyName?: string;
  companyLogo?: string;
  includeFooter?: boolean;
}

/**
 * Exports the meeting summary as a PDF file
 */
export const exportMeetingSummaryAsPDF = async (
  summary: string,
  duration: number,
  location?: string | null,
  attendees?: string[] | null,
  options: MeetingSummaryPDFOptions = {}
): Promise<void> => {
  // Get current date and time
  const today = new Date();
  const dateString = today.toLocaleDateString();
  const timeString = today.toLocaleTimeString();
  
  // Extract agenda items and tasks from summary
  const agendaItems = extractAgendaItems(summary);
  const tasks = extractTasks(summary);
  
  // Create PDF content
  const pdfContent = `
    <div style="font-family: Arial, sans-serif; margin: 40px;">
      <div style="max-width: 800px; margin: auto; padding: 30px; border: 1px solid #ddd;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <img src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
               alt="WAKTI Logo" 
               style="width: 70px; height: auto;" />
          <div style="font-size: 28px; font-weight: bold;">MEETING SUMMARY</div>
        </div>

        <div style="margin: 20px 0; font-size: 14px; display: flex; gap: 40px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
          <div>Date: ${dateString}</div>
          <div>Time: ${timeString}</div>
          <div>Duration: ${formatTime(duration)}</div>
          ${location ? `<div>Location: ${location}</div>` : ''}
        </div>

        <div style="font-weight: bold; margin: 20px 0 5px; font-size: 16px;">SUMMARY</div>
        <div style="border: 1px solid #ccc; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          ${summary.split('## ')[0].trim()}
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div style="width: 48%;">
            <div style="font-weight: bold; margin: 20px 0 5px; font-size: 16px;">AGENDA</div>
            ${agendaItems.map(item => `
              <div style="margin: 6px 0;">- ${item}</div>
            `).join('')}
          </div>
          
          <div style="width: 48%;">
            <div style="font-weight: bold; margin: 20px 0 5px; font-size: 16px;">
              TASKS <span style="float: right; font-weight: normal;">COMPLETION DATE</span>
            </div>
            ${tasks.map(task => `
              <div style="margin: 6px 0;">[ ] ${task} ............................................. TBD</div>
            `).join('')}
          </div>
        </div>

        ${attendees && attendees.length > 0 ? `
          <div>
            <div style="font-weight: bold; margin: 20px 0 5px; font-size: 16px;">ATTENDEES</div>
            <div style="margin-bottom: 20px;">${attendees.join(', ')}</div>
          </div>
        ` : ''}

        <div style="text-align: center; font-size: 12px; color: #777; margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px;">
          Powered by WAKTI
        </div>
      </div>
    </div>
  `;

  // Configure PDF options
  const element = document.createElement('div');
  element.innerHTML = pdfContent;
  document.body.appendChild(element);

  const pdfOptions = {
    margin: 0,
    filename: `meeting_summary_${today.toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().from(element).set(pdfOptions).save();
  } finally {
    document.body.removeChild(element);
  }
};

// Helper function to extract agenda items from summary
const extractAgendaItems = (summary: string): string[] => {
  const agendaSection = summary.match(/##\s*Agenda[^#]*(?=##|$)/i);
  if (!agendaSection) return [];

  return agendaSection[0]
    .replace(/^##\s*Agenda\s*/i, '')
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .map(line => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
};

// Helper function to extract tasks from summary
const extractTasks = (summary: string): string[] => {
  const tasksSection = summary.match(/##\s*Action Items[^#]*(?=##|$)/i);
  if (!tasksSection) return [];

  return tasksSection[0]
    .replace(/^##\s*Action Items\s*/i, '')
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .map(line => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
};

/**
 * Creates a download link for audio data
 * @param audioData Audio blob
 * @param filename Filename for the download
 */
export const downloadAudioFile = (audioData: Blob, filename = 'meeting_recording.webm'): void => {
  const url = URL.createObjectURL(audioData);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
