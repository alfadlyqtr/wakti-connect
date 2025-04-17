
import { jsPDF } from 'jspdf';
import { formatDuration } from '@/utils/text/transcriptionUtils';

export interface LectureNotesExportContext {
  course?: string;
  lecturer?: string;
  university?: string;
  date?: string;
}

export const exportLectureNotesAsPDF = async (
  notes: string,
  recordingDuration: number,
  context?: LectureNotesExportContext | null
): Promise<void> => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set up fonts
  pdf.setFont("helvetica");
  
  // Set title
  pdf.setFontSize(18);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Lecture Notes", 20, 20);
  
  // Add metadata line
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  
  const now = new Date().toLocaleDateString();
  pdf.text(`Exported on: ${now} • Duration: ${formatDuration(recordingDuration)}`, 20, 27);
  
  // Add separator
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, 30, 190, 30);
  
  // Add context information if available
  let yPosition = 35;
  
  if (context) {
    const contextItems = [];
    
    if (context.course) {
      contextItems.push(`Course: ${context.course}`);
    }
    
    if (context.lecturer) {
      contextItems.push(`Lecturer: ${context.lecturer}`);
    }
    
    if (context.university) {
      contextItems.push(`Institution: ${context.university}`);
    }
    
    if (context.date) {
      contextItems.push(`Date: ${context.date}`);
    }
    
    if (contextItems.length > 0) {
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      
      for (const item of contextItems) {
        pdf.text(item, 20, yPosition);
        yPosition += 6;
      }
      
      // Add separator after context
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition, 190, yPosition);
      yPosition += 5;
    }
  }
  
  // Format and add notes content
  const formattedNotes = formatNotesForPDF(notes);
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  
  const splitText = pdf.splitTextToSize(formattedNotes, 170);
  
  pdf.text(splitText, 20, yPosition);
  
  // Add footer
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${i} of ${pageCount} | Generated with WAKTI Lecture Notes Tool`, 20, 287);
  }
  
  // Save the PDF
  pdf.save('lecture_notes.pdf');
};

// Helper function to format notes for PDF
const formatNotesForPDF = (notes: string): string => {
  // Replace markdown headers and formatting
  let formatted = notes
    .replace(/^## (.*$)/gm, '\n$1\n')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/- (.*?)(?:\n|$)/g, '• $1\n');
  
  return formatted;
};
