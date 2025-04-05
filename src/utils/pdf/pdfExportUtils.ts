
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
        <img src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;" />
      </div>
      <div>
        <span style="color: #333; font-size: 22px; font-weight: bold;">${isArabicContent ? 'ملخص الاجتماع' : 'Meeting Summary'}</span>
        <div style="color: #666; font-size: 14px; margin-top: 5px;">${isArabicContent ? 'تم إنشاؤه في' : 'Generated on'} ${new Date().toLocaleDateString(isArabicContent ? 'ar-SA' : 'en-US')} ${isArabicContent ? 'في' : 'at'} ${new Date().toLocaleTimeString(isArabicContent ? 'ar-SA' : 'en-US')}</div>
      </div>
    </div>
    <div style="color: #0053c3; font-size: 14px; font-weight: bold;">${isArabicContent ? 'مدعوم بواسطة مجموعة أدوات وقتي للإنتاجية' : 'Powered by WAKTI Productivity Suite'}</div>
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
  metadataDiv.style.borderRadius = '6px';
  metadataDiv.style.border = '1px solid #e9ecef';
  
  // Create styled metadata table
  metadataDiv.innerHTML = `
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
  return summary
    // Style headings
    .replace(/^## (.*)/gm, '<h2 style="color: #0053c3; font-size: 20px; margin-top: 30px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e9ecef;">$1</h2>')
    .replace(/^### (.*)/gm, '<h3 style="color: #0053c3; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">$1</h3>')
    // Style lists
    .replace(/^\* (.*)/gm, '<li style="margin-bottom: 8px;">$1</li>')
    .replace(/^- (.*)/gm, '<li style="margin-bottom: 8px;">$1</li>')
    .replace(/^(\d+)\. (.*)/gm, '<li style="margin-bottom: 8px;"><strong>$1.</strong> $2</li>')
    // Wrap lists
    .replace(/(<li.*<\/li>)\n(<li.*<\/li>)/g, '$1\n<ul style="margin-bottom: 15px; padding-left: 20px;">$2')
    .replace(/(<li.*<\/li>)\n(?!<li)/g, '$1</ul>\n')
    // Style bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert newlines to breaks
    .replace(/\n\n/g, '<br /><br />');
};
