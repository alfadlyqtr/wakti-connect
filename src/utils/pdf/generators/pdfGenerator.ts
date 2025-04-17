
/**
 * Core PDF generation functionality
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { processSummaryContent } from '../processors/summaryContentProcessor';
import { createMeetingSummaryTemplate } from '../templates/meetingSummaryTemplate';

/**
 * Generates and exports a PDF document from the meeting summary
 * @param summary The meeting summary text
 * @param recordingTime The recording duration in seconds
 * @param detectedLocation Optional location information
 */
export const generatePdf = async (
  summary: string,
  recordingTime: number,
  detectedLocation: string | null
): Promise<void> => {
  try {
    // Process the summary content
    const { summary: formattedSummary, tasks } = processSummaryContent(summary);
    
    // Create the HTML template for PDF
    const htmlTemplate = createMeetingSummaryTemplate(
      summary,
      recordingTime,
      detectedLocation,
      formattedSummary,
      tasks
    );
    
    // Create a temporary div to render the template
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlTemplate;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.backgroundColor = '#ffffff';
    
    // Add to document for rendering
    document.body.appendChild(tempDiv);
    
    // Convert to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    // Generate PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    
    const imgWidth = 595; // A4 width in points
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Add multiple pages if needed
    if (imgHeight > 842) {
      let heightLeft = imgHeight - 842;
      let position = -842;
      
      while (heightLeft > 0) {
        position = position - 842;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 842;
      }
    }
    
    // Save the PDF
    pdf.save(`meeting-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
    
    // Clean up
    document.body.removeChild(tempDiv);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
