
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Function to export the meeting summary as PDF
export const exportMeetingSummaryAsPDF = async (
  summary: string,
  recordingTime: number,
  detectedLocation: string | null
) => {
  try {
    // Create a temporary div with the summary content
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '595px'; // A4 width in pixels at 72 dpi
    tempDiv.style.padding = '40px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    
    // Add title and metadata
    let content = `
      <h1 style="font-size: 24px; margin-bottom: 20px;">Meeting Summary</h1>
      <div style="margin-bottom: 20px; font-size: 14px; color: #666;">
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Duration:</strong> ${Math.floor(recordingTime / 60)}m ${recordingTime % 60}s</p>
        ${detectedLocation ? `<p><strong>Location:</strong> ${detectedLocation}</p>` : ''}
      </div>
      <div style="font-size: 14px; line-height: 1.5;">
        ${summary.replace(/\n/g, '<br>')}
      </div>
    `;
    
    tempDiv.innerHTML = content;
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
    
    // Save the PDF
    pdf.save(`meeting-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
    
    // Clean up
    document.body.removeChild(tempDiv);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
