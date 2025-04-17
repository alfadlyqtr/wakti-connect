
/**
 * Utilities for generating PDF metadata content
 */

import { formatTime } from '../helpers/timeFormatters';

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
  detectedLocation: string | null
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
