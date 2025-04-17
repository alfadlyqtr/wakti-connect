/**
 * Utilities for PDF document generation and export
 */
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Process summary content for PDF export
 * @param summary The markdown summary content
 * @returns HTML-formatted content
 */
export const processSummaryContent = (summary: string): string => {
  // Extract any tasks if present
  let tasks = "";
  const taskMatch = summary.match(/##\s*Action Items[^#]*(?=##|$)/i);
  
  if (taskMatch) {
    const taskLines = taskMatch[0]
      .replace(/^##\s*Action Items\s*/i, '')
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-*]\s*/, '').trim())
      .filter(line => line.length > 0);
    
    tasks = taskLines.map(task => 
      `<div class="line-item">[ ] ${task} ............................................. Date</div>`
    ).join('');
  }
  
  // Format the summary content for display
  const formattedSummary = summary
    .replace(/##\s*.*?\n/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br><br>')
    .trim();
  
  return {
    summary: formattedSummary,
    tasks: tasks
  };
};

/**
 * Creates the meeting summary HTML template for PDF exports
 */
export const createPdfHeaderDiv = (
  summary: string,
  recordingTime: number,
  detectedLocation: string | null,
  formatTime: (seconds: number) => string
): string => {
  
  // Process the summary content
  const { summary: formattedSummary, tasks } = processSummaryContent(summary);
  
  // Format meeting date
  const meetingDate = new Date().toLocaleDateString();
  
  // Format meeting time
  const meetingTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Format duration
  const duration = formatTime(recordingTime);
  
  // Create a list of agenda items (extracted from summary)
  const agendaItems = summary
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .slice(0, 3) // Limit to 3 items
    .map(line => line.replace(/^[-*]\s*/, '').trim())
    .filter(line => line.length > 0)
    .map(item => `<div class="line-item">- ${item}</div>`)
    .join('');
  
  // Create a default list if no agenda items found
  const defaultAgenda = `
    <div class="line-item">- Discussion of project status</div>
    <div class="line-item">- Review of action items</div>
    <div class="line-item">- Planning next steps</div>
  `;
  
  // Create default tasks if none found
  const defaultTasks = `
    <div class="line-item">[ ] Follow up on discussion items ............................................. Date</div>
    <div class="line-item">[ ] Share meeting summary ............................................. Date</div>
    <div class="line-item">[ ] Schedule next meeting ............................................. Date</div>
  `;
  
  // Return the complete HTML template
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Meeting Summary</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          background: #fff;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .header img {
          width: 70px;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
        }
        .info {
          margin: 20px 0;
          font-size: 14px;
          display: flex;
          gap: 40px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 10px;
        }
        .section-title {
          font-weight: bold;
          margin: 20px 0 5px;
          font-size: 16px;
        }
        .summary-box {
          border: 1px solid #ccc;
          border-radius: 8px;
          min-height: 100px;
          padding: 10px;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .row {
          display: flex;
          justify-content: space-between;
        }
        .column {
          width: 48%;
        }
        .agenda-tasks {
          margin-bottom: 30px;
        }
        .line-item {
          margin: 6px 0;
        }
        .attendees {
          margin-bottom: 20px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777;
          margin-top: 40px;
          border-top: 1px solid #eee;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" alt="Wakti Logo" />
          <div class="title">MEETING SUMMARY</div>
        </div>
        <div class="info">
          <div>Date: ${meetingDate}</div>
          <div>Time: ${meetingTime}</div>
          <div>Duration: ${duration}</div>
          ${detectedLocation ? `<div>Location: ${detectedLocation}</div>` : ''}
        </div>

        <div class="section-title">SUMMARY</div>
        <div class="summary-box">${formattedSummary}</div>

        <div class="agenda-tasks row">
          <div class="column">
            <div class="section-title">AGENDA</div>
            ${agendaItems || defaultAgenda}
          </div>
          <div class="column">
            <div class="section-title">TASKS <span style="float: right; font-weight: normal;">COMPLETION DATE</span></div>
            ${tasks || defaultTasks}
          </div>
        </div>

        <div class="section-title">ATTENDEES</div>
        <div class="attendees">Virtual Meeting Participants</div>

        <div class="footer">Powered by WAKTI</div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Creates a metadata table div for PDF exports
 * @param isArabicContent Whether the content is in Arabic (affects direction)
 * @param recordingTime The recording duration in seconds
 * @param detectedLocation Optional location information
 * @returns The metadata div element
 */
export const createPdfMetadataDiv = (
  isArabicContent: boolean, 
  recordingTime: number, 
  detectedLocation: string | null,
  formatTime: (seconds: number) => string
): HTMLDivElement => {
  const metadataDiv = document.createElement('div');
  metadataDiv.style.marginBottom = '25px';
  metadataDiv.style.backgroundColor = '#f8f9fa';
  metadataDiv.style.padding = '15px';
  metadataDiv.style.borderRadius = '8px';
  metadataDiv.style.border = '1px solid #e9ecef';
  metadataDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
  
  // Create styled metadata table
  metadataDiv.innerHTML = `
    <h3 style="margin-top: 0; margin-bottom: 10px; color: #0053c3; font-size: 18px; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Meeting Information</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; direction: ${isArabicContent ? 'rtl' : 'ltr'}">
      <tr>
        <td style="padding: 8px 15px; width: 120px; font-weight: bold; color: #0053c3;">${isArabicContent ? 'التاريخ:' : 'Date:'}</td>
        <td style="padding: 8px 15px;">${new Date().toLocaleDateString(isArabicContent ? 'ar-SA' : 'en-US')}</td>
        <td style="padding: 8px 15px; width: 120px; font-weight: bold; color: #0053c3;">${isArabicContent ? 'المدة:' : 'Duration:'}</td>
        <td style="padding: 8px 15px;">${formatTime(recordingTime)}</td>
      </tr>
      ${detectedLocation ? `
      <tr>
        <td style="padding: 8px 15px; font-weight: bold; color: #0053c3;">${isArabicContent ? 'الموقع:' : 'Location:'}</td>
        <td style="padding: 8px 15px;" colspan="3">${detectedLocation}</td>
      </tr>` : ''}
    </table>
  `;
  
  return metadataDiv;
};

/**
 * Exports the meeting summary as PDF
 * @param summary The meeting summary text
 * @param recordingTime The recording duration in seconds
 * @param detectedLocation Optional location information
 */
export const exportMeetingSummary = async (
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
    
    // Create the HTML template for PDF
    const htmlTemplate = createPdfHeaderDiv(
      summary,
      recordingTime,
      detectedLocation,
      formatTime
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
