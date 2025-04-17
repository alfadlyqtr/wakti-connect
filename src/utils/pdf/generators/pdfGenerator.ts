
import jsPDF from 'jspdf';
import { formatTime } from '../helpers/timeFormatters';
import { processSummaryContent } from '../processors/summaryContentProcessor';
import { MeetingContext } from '@/utils/text/transcriptionUtils';

export const generatePdf = async (
  summary: string,
  recordingTime: number,
  meetingContext: MeetingContext | null = null
) => {
  const doc = new jsPDF();
  const { summary: processedSummary, tasks } = processSummaryContent(summary);
  
  // Set up document
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Meeting Summary', 20, 20);
  
  // Add date and duration
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
  doc.text(`Duration: ${formatTime(recordingTime)}`, 20, 37);
  
  // Add meeting context if available
  let yOffset = 44;
  
  if (meetingContext) {
    if (meetingContext.location) {
      doc.text(`Location: ${meetingContext.location}`, 20, yOffset);
      yOffset += 7;
    }
    
    if (meetingContext.participants && meetingContext.participants.length > 0) {
      const participantsText = Array.isArray(meetingContext.participants)
        ? meetingContext.participants.join(', ')
        : meetingContext.participants;
        
      // Check if participants text is too long
      if (participantsText.length > 70) {
        doc.text('Participants:', 20, yOffset);
        yOffset += 7;
        
        const splitParticipants = doc.splitTextToSize(participantsText, 170);
        doc.text(splitParticipants, 25, yOffset);
        yOffset += splitParticipants.length * 7;
      } else {
        doc.text(`Participants: ${participantsText}`, 20, yOffset);
        yOffset += 7;
      }
    }
    
    if (meetingContext.host) {
      doc.text(`Host: ${meetingContext.host}`, 20, yOffset);
      yOffset += 7;
    }
  }
  
  // Add separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yOffset, 190, yOffset);
  yOffset += 10;
  
  // Add summary title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Summary', 20, yOffset);
  yOffset += 10;
  
  // Add summary content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
  const splitSummary = doc.splitTextToSize(processedSummary, 170);
  doc.text(splitSummary, 20, yOffset);
  
  // Calculate next Y position based on summary length
  yOffset += splitSummary.length * 7 + 10;
  
  // Add tasks section if available
  if (tasks) {
    // Check if we need a new page for tasks
    if (yOffset > 250) {
      doc.addPage();
      yOffset = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Action Items', 20, yOffset);
    yOffset += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    // Process tasks
    const taskList = tasks.split('[ ]').map(t => t.trim()).filter(t => t.length > 0);
    for (const task of taskList) {
      doc.text(`□ ${task.split('Date')[0].trim()}`, 20, yOffset);
      yOffset += 7;
      
      // Add new page if necessary
      if (yOffset > 280) {
        doc.addPage();
        yOffset = 20;
      }
    }
  }
  
  // Save the PDF
  doc.save('meeting-summary.pdf');
};
