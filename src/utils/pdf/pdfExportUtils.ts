
/**
 * Utilities for PDF document generation and export
 */
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Creates a styled header div for PDF exports
 * @param isArabicContent Whether the content is in Arabic (affects direction)
 * @returns The header div element with logo and title
 */
export const createPdfHeaderDiv = (isArabicContent: boolean): HTMLDivElement => {
  const headerDiv = document.createElement('div');
  headerDiv.style.marginBottom = '30px';
  headerDiv.style.paddingBottom = '15px';
  headerDiv.style.borderBottom = '2px solid #0053c3';
  headerDiv.style.display = 'flex';
  headerDiv.style.justifyContent = 'space-between';
  headerDiv.style.alignItems = 'center';
  
  // Logo and title with enhanced styling
  headerDiv.innerHTML = `
    <div style="display: flex; align-items: center;">
      <div style="margin-right: 15px;">
        <img src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
      </div>
      <div>
        <h1 style="color: #0053c3; font-size: 28px; font-weight: bold; margin: 0; padding: 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.05);">${isArabicContent ? 'ملخص الاجتماع' : 'Meeting Summary'}</h1>
        <div style="color: #666; font-size: 14px; margin-top: 5px;">${isArabicContent ? 'تم إنشاؤه في' : 'Generated on'} ${new Date().toLocaleDateString(isArabicContent ? 'ar-SA' : 'en-US')} ${isArabicContent ? 'في' : 'at'} ${new Date().toLocaleTimeString(isArabicContent ? 'ar-SA' : 'en-US')}</div>
      </div>
    </div>
    <div style="flex-shrink: 0;">
      <img src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" style="width: 30px; height: 30px; border-radius: 4px; object-fit: cover; opacity: 0.7;" />
    </div>
  `;
  
  return headerDiv;
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
 * Process summary content for PDF export
 * @param summary The markdown summary content
 * @returns HTML-formatted content
 */
export const processSummaryContent = (summary: string): string => {
  // Extract any tasks if present
  let tasks = "";
  const taskMatch = summary.match(/##\s*Action Items[^#]*(?=##|$)/i);
  
  if (taskMatch) {
    tasks = `
      <div style="margin-top: 30px; margin-bottom: 30px; padding: 20px; background-color: #f0f9ff; border-left: 4px solid #0053c3; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <h3 style="color: #0053c3; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Action Items:</h3>
        <ul style="margin-top: 10px; padding-left: 20px; list-style-type: none;">
          ${taskMatch[0].replace(/^##\s*Action Items\s*/i, '')
            .split('\n')
            .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
            .map(line => `<li style="margin-bottom: 10px; position: relative; padding-left: 22px;">
              <span style="position: absolute; left: 0; top: 5px; height: 10px; width: 10px; background-color: #0053c3; border-radius: 50%;"></span>
              ${line.replace(/^[-*]\s*/, '')}
            </li>`)
            .join('')
          }
        </ul>
      </div>
    `;
  }
  
  // Process the main content with improved formatting
  let processedContent = summary
    // Style headings with improved formatting
    .replace(/^## (.*)/gm, '<h2 style="color: #0053c3; font-size: 22px; margin-top: 35px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef; font-weight: 600;">$1</h2>')
    .replace(/^### (.*)/gm, '<h3 style="color: #0053c3; font-size: 18px; margin-top: 25px; margin-bottom: 10px; font-weight: 600;">$1</h3>')
    
    // Highlight important terms (dates, numbers, names)
    .replace(/\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/g, '<span style="background-color: #f0f9ff; padding: 2px 4px; border-radius: 3px; font-weight: 500;">$1</span>') // dates
    .replace(/\b(\d{1,2}:\d{2}(?:am|pm|AM|PM)?)\b/g, '<span style="background-color: #f0f9ff; padding: 2px 4px; border-radius: 3px; font-weight: 500;">$1</span>') // times
    .replace(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)\b/g, '<span style="background-color: #f0f9ff; padding: 2px 4px; border-radius: 3px; font-weight: 500;">$$$1</span>') // money
    
    // Style lists with custom bullets and spacing
    .replace(/^\* (.*)/gm, '<li style="margin-bottom: 10px; position: relative; padding-left: 18px;"><span style="position: absolute; left: 0; top: 8px; height: 6px; width: 6px; background-color: #0053c3; border-radius: 50%;"></span>$1</li>')
    .replace(/^- (.*)/gm, '<li style="margin-bottom: 10px; position: relative; padding-left: 18px;"><span style="position: absolute; left: 0; top: 8px; height: 6px; width: 6px; background-color: #0053c3; border-radius: 50%;"></span>$1</li>')
    .replace(/^(\d+)\. (.*)/gm, '<li style="margin-bottom: 10px;"><strong style="color: #0053c3;">$1.</strong> $2</li>')
    
    // Wrap lists with proper styling
    .replace(/(<li.*<\/li>)\n(<li.*<\/li>)/g, '$1\n<ul style="margin-bottom: 20px; padding-left: 5px; list-style-type: none;">$2')
    .replace(/(<li.*<\/li>)\n(?!<li)/g, '$1</ul>\n')
    
    // Style bold and italic with improved visuals
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0053c3;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: #555;">$1</em>')
    
    // Convert newlines to breaks with proper spacing
    .replace(/\n\n/g, '<div style="margin: 15px 0;"></div>');
  
  // Structure the content into clearly defined sections with improved styling
  let structuredContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <section>
        <h2 style="color: #0053c3; font-size: 22px; margin-top: 35px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">Key Points</h2>
        ${processedContent}
      </section>
      
      ${tasks}
      
      <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center; color: #6c757d; font-size: 12px;">
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
          <img src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" style="width: 20px; height: 20px; margin-right: 5px; border-radius: 3px;" />
          <span>Powered by WAKTI AI Meeting Summary Tool</span>
        </div>
        <div>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
      </footer>
    </div>
  `;
  
  return structuredContent;
};
