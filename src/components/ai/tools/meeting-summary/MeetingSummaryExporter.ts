
import { formatTime } from '@/utils/audio/audioProcessing';
import html2pdf from 'html2pdf.js';
import { getMapThumbnailUrl } from '@/utils/mapUtils';

export interface MeetingSummaryPDFOptions {
  title?: string;
  companyName?: string;
  companyLogo?: string;
  includeFooter?: boolean;
  isRTL?: boolean;
}

// Extract title from meeting summary
const extractTitleFromSummary = (summary: string): string => {
  const titleMatch = summary.match(/Meeting Title:\s*([^\n]+)/i) || 
                     summary.match(/Title:\s*([^\n]+)/i) ||
                     summary.match(/^# ([^\n]+)/m) ||
                     summary.match(/^## ([^\n]+)/m) ||
                     summary.match(/عنوان الاجتماع:\s*([^\n]+)/i) ||
                     summary.match(/^# ([^\n]+)/m);
                     
  return titleMatch ? titleMatch[1].trim() : 'Meeting Summary';
};

/**
 * Exports the meeting summary as a PDF file
 * @param summary The HTML summary content
 * @param duration The meeting duration in seconds
 * @param location Optional meeting location
 * @param attendees Optional list of meeting attendees
 * @param options Additional PDF options
 */
export const exportMeetingSummaryAsPDF = async (
  summary: string,
  duration: number,
  location?: string | null,
  attendees?: string[] | null,
  options: MeetingSummaryPDFOptions = {}
): Promise<void> => {
  // Detect if content is RTL if not explicitly provided
  const isRTL = options.isRTL !== undefined 
    ? options.isRTL 
    : /[\u0600-\u06FF]/.test(summary);
  
  // Create PDF content with enhanced styling
  const today = new Date();
  const dateString = today.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
  const timeString = today.toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US');
  
  const title = options.title || extractTitleFromSummary(summary) || (isRTL ? 'ملخص الاجتماع' : 'Meeting Summary');
  const companyName = options.companyName || 'WAKTI';
  const includeFooter = options.includeFooter !== false;

  // Create PDF container
  const container = document.createElement('div');
  container.style.fontFamily = isRTL ? 'Arial, sans-serif, "Traditional Arabic"' : 'Arial, sans-serif';
  container.style.direction = isRTL ? 'rtl' : 'ltr';
  container.style.padding = '20px';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.style.backgroundColor = 'white';
  container.style.color = '#333';
  
  // Create header
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.borderBottom = '2px solid #0053c3';
  header.style.marginBottom = '20px';
  header.style.paddingBottom = '10px';
  
  // Logo
  const logo = document.createElement('div');
  logo.innerHTML = `
    <img src="${options.companyLogo || '/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png'}" 
      style="width: 50px; height: 50px; object-fit: contain;" />
  `;
  
  // Title
  const titleDiv = document.createElement('div');
  titleDiv.style.flex = '1';
  titleDiv.style.textAlign = isRTL ? 'right' : 'left';
  titleDiv.style.marginLeft = isRTL ? '0' : '15px';
  titleDiv.style.marginRight = isRTL ? '15px' : '0';
  titleDiv.innerHTML = `
    <h1 style="margin: 0; color: #0053c3; font-size: 24px;">${title}</h1>
    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">
      ${isRTL ? `${dateString} - ${timeString}` : `${dateString} - ${timeString}`}
    </p>
  `;
  
  if (isRTL) {
    header.appendChild(titleDiv);
    header.appendChild(logo);
  } else {
    header.appendChild(logo);
    header.appendChild(titleDiv);
  }
  
  container.appendChild(header);
  
  // Create metadata section
  const metadataSection = document.createElement('div');
  metadataSection.style.marginBottom = '20px';
  metadataSection.style.padding = '15px';
  metadataSection.style.backgroundColor = '#f8f9fa';
  metadataSection.style.borderRadius = '5px';
  metadataSection.style.border = '1px solid #e9ecef';
  
  // Format duration
  const formattedDuration = formatTime ? formatTime(duration) : 
    `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`;
  
  // Metadata content
  let metadataHTML = `
    <h2 style="margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #0053c3;">
      ${isRTL ? 'معلومات الاجتماع' : 'Meeting Information'}
    </h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; font-weight: bold; width: 120px; color: #0053c3;">
          ${isRTL ? 'المدة:' : 'Duration:'}
        </td>
        <td style="padding: 8px;">${formattedDuration}</td>
  `;
  
  if (location) {
    metadataHTML += `
        <td style="padding: 8px; font-weight: bold; width: 120px; color: #0053c3;">
          ${isRTL ? 'الموقع:' : 'Location:'}
        </td>
        <td style="padding: 8px;">${location}</td>
      </tr>
    `;
  } else {
    metadataHTML += `
      </tr>
    `;
  }
  
  metadataHTML += `</table>`;
  
  // Add attendees if available
  if (attendees && attendees.length > 0) {
    metadataHTML += `
      <div style="margin-top: 10px;">
        <h3 style="font-size: 14px; color: #0053c3; margin-bottom: 5px;">
          ${isRTL ? 'الحاضرون:' : 'Attendees:'}
        </h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
    `;
    
    attendees.forEach(attendee => {
      metadataHTML += `
        <span style="background-color: #e6f3ff; border-radius: 4px; padding: 4px 8px; font-size: 12px;">
          ${attendee}
        </span>
      `;
    });
    
    metadataHTML += `
        </div>
      </div>
    `;
  }
  
  metadataSection.innerHTML = metadataHTML;
  container.appendChild(metadataSection);
  
  // Process and add the main content
  const contentSection = document.createElement('div');
  contentSection.style.lineHeight = '1.6';
  
  // Process markdown content to HTML
  let processedContent = summary
    // Handle headers
    .replace(/^## (.*)/gm, '<h2 style="color: #0053c3; font-size: 18px; margin-top: 20px; margin-bottom: 10px;">$1</h2>')
    .replace(/^### (.*)/gm, '<h3 style="color: #0053c3; font-size: 16px; margin-top: 15px; margin-bottom: 8px;">$1</h3>')
    // Handle lists
    .replace(/^- (.*)/gm, '<li style="margin-bottom: 8px;">$1</li>')
    .replace(/^\* (.*)/gm, '<li style="margin-bottom: 8px;">$1</li>')
    // Handle paragraphs
    .replace(/^([^<#\-\*].+)/gm, '<p style="margin-bottom: 15px;">$1</p>')
    // Wrap lists
    .replace(/(<li.+<\/li>)(?!\n<li)/gs, '<ul style="margin-bottom: 15px; padding-left: 20px;">$1</ul>')
    // Handle newlines
    .replace(/\n\n/g, '<br />');
  
  contentSection.innerHTML = processedContent;
  container.appendChild(contentSection);
  
  // Add footer if enabled
  if (includeFooter) {
    const footer = document.createElement('div');
    footer.style.marginTop = '30px';
    footer.style.paddingTop = '15px';
    footer.style.borderTop = '1px solid #e9ecef';
    footer.style.textAlign = 'center';
    footer.style.fontSize = '12px';
    footer.style.color = '#6c757d';
    
    footer.innerHTML = isRTL
      ? `تم إنشاؤه بواسطة WAKTI AI - ${dateString}`
      : `Generated by WAKTI AI - ${dateString}`;
    
    container.appendChild(footer);
  }
  
  // Generate PDF
  const pdfOptions = {
    margin: [15, 15, 15, 15],
    filename: `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${dateString.replace(/\//g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  try {
    await html2pdf().from(container).set(pdfOptions).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
