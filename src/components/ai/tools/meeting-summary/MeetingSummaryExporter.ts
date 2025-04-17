
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { createPdfHeaderDiv, createPdfMetadataDiv, processSummaryContent } from '@/utils/pdf/pdfExportUtils';

// Function to export the meeting summary as PDF
export const exportMeetingSummaryAsPDF = async (
  summary: string,
  recordingTime: number,
  detectedLocation: string | null
) => {
  try {
    // Format time function
    const formatTime = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      
      if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      } else {
        return `${remainingSeconds}s`;
      }
    };
    
    // Detect if content is Arabic
    const isArabicContent = /[\u0600-\u06FF]/.test(summary) && 
                         summary.match(/[\u0600-\u06FF]/g)!.length > summary.length * 0.3;
    
    // Create a temporary div with the summary content
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '595px'; // A4 width in pixels at 72 dpi
    tempDiv.style.padding = '40px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.direction = isArabicContent ? 'rtl' : 'ltr';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.style.color = '#333333';
    
    // Create header div
    const headerDiv = createPdfHeaderDiv(isArabicContent);
    tempDiv.appendChild(headerDiv);
    
    // Create metadata div
    const metadataDiv = createPdfMetadataDiv(isArabicContent, recordingTime, detectedLocation, formatTime);
    tempDiv.appendChild(metadataDiv);
    
    // Process the summary content
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = processSummaryContent(summary);
    tempDiv.appendChild(contentDiv);
    
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
