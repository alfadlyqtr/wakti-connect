
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { formatTime } from '@/utils/audio/audioProcessing';
import { createPdfHeaderDiv, createPdfMetadataDiv, processSummaryContent } from '@/utils/pdf/pdfExportUtils';

/**
 * Exports the meeting summary as a PDF file
 * @param summary The markdown summary text
 * @param recordingTime The duration of the meeting in seconds
 * @param detectedLocation Optional location information
 */
export const exportMeetingSummaryAsPDF = async (
  summary: string,
  recordingTime: number,
  detectedLocation: string | null
) => {
  if (!summary) return;
  
  try {
    // Create a temporary container for the PDF export
    const pdfContainer = document.createElement('div');
    pdfContainer.style.width = '800px';
    pdfContainer.style.padding = '40px';
    pdfContainer.style.backgroundColor = '#ffffff';
    pdfContainer.style.color = '#000000';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(pdfContainer);
    
    // Check if content is in Arabic
    const isArabicContent = /[\u0600-\u06FF]/.test(summary);
    if (isArabicContent) {
      pdfContainer.style.direction = 'rtl';
      pdfContainer.style.textAlign = 'right';
    }
    
    // Add WAKTI branding header
    const headerDiv = createPdfHeaderDiv(isArabicContent);
    pdfContainer.appendChild(headerDiv);
    
    // Add meeting metadata table
    const metadataDiv = createPdfMetadataDiv(isArabicContent, recordingTime, detectedLocation, formatTime);
    pdfContainer.appendChild(metadataDiv);
    
    // Process the summary content to apply enhanced styling
    const contentDiv = document.createElement('div');
    contentDiv.style.lineHeight = '1.6';
    
    // Style the content with enhanced formatting
    const styledContent = processSummaryContent(summary);
    contentDiv.innerHTML = styledContent;
    pdfContainer.appendChild(contentDiv);
    
    // Use html2canvas to capture the PDF container
    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Calculate dimensions to fit the content into the PDF
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let pdfHeight = 0;
    let position = 0;
    
    // If content is too tall for one page, split it across multiple pages
    while (position < imgHeight) {
      if (position > 0) {
        pdf.addPage();
      }
      
      const contentHeight = Math.min(297, imgHeight - position); // 297mm is A4 height
      
      pdf.addImage(
        imgData,
        'PNG',
        0,
        -position,
        imgWidth,
        imgHeight
      );
      
      position += 297;
    }
    
    // Save the PDF
    const meetingDate = new Date().toISOString().slice(0, 10);
    pdf.save(`WAKTI_Meeting_Summary_${meetingDate}.pdf`);
    
    // Clean up
    document.body.removeChild(pdfContainer);
    
    return true;
  } catch (error) {
    console.error('Error creating PDF:', error);
    return false;
  }
};
