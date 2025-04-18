
/**
 * Creates a div element for the PDF header with WAKTI branding
 * @param isRTL Whether the content is right-to-left
 * @returns HTML div element ready for PDF generation
 */
export const createPdfHeaderDiv = (isRTL = false): HTMLDivElement => {
  const headerDiv = document.createElement('div');
  headerDiv.style.direction = isRTL ? 'rtl' : 'ltr';
  headerDiv.style.marginBottom = '20px';
  headerDiv.style.display = 'flex';
  headerDiv.style.alignItems = 'center';
  headerDiv.style.justifyContent = 'space-between';
  
  // WAKTI branding
  const logoDiv = document.createElement('div');
  logoDiv.style.fontWeight = 'bold';
  logoDiv.style.fontSize = '24px';
  logoDiv.style.color = '#4A6CF7';
  logoDiv.textContent = 'WAKTI';
  
  // Meeting info
  const dateDiv = document.createElement('div');
  dateDiv.style.fontSize = '14px';
  dateDiv.style.color = '#666';
  dateDiv.textContent = `Meeting Summary | ${new Date().toLocaleDateString()}`;
  
  headerDiv.appendChild(logoDiv);
  headerDiv.appendChild(dateDiv);
  
  return headerDiv;
};

/**
 * Creates a div element for meeting metadata like duration and location
 * @param isRTL Whether content is right-to-left
 * @param recordingTime Duration in seconds
 * @param detectedLocation Optional location string
 * @param formatTimeFunc Function to format time
 * @returns HTML div element ready for PDF generation
 */
export const createPdfMetadataDiv = (
  isRTL = false,
  recordingTime = 0,
  detectedLocation: string | null = null,
  formatTimeFunc: (seconds: number, showHours?: boolean) => string
): HTMLDivElement => {
  const metadataDiv = document.createElement('div');
  metadataDiv.style.direction = isRTL ? 'rtl' : 'ltr';
  metadataDiv.style.marginBottom = '30px';
  metadataDiv.style.padding = '15px';
  metadataDiv.style.backgroundColor = '#f8f9fa';
  metadataDiv.style.borderRadius = '6px';
  
  // Duration row
  const durationDiv = document.createElement('div');
  durationDiv.style.marginBottom = '6px';
  durationDiv.style.display = 'flex';
  durationDiv.style.justifyContent = isRTL ? 'flex-end' : 'flex-start';
  
  const durationLabel = document.createElement('span');
  durationLabel.style.fontWeight = 'bold';
  durationLabel.style.marginRight = '8px';
  durationLabel.textContent = isRTL ? 'المدة: ' : 'Duration: ';
  
  const durationValue = document.createElement('span');
  durationValue.textContent = formatTimeFunc(recordingTime, true);
  
  durationDiv.appendChild(durationLabel);
  durationDiv.appendChild(durationValue);
  metadataDiv.appendChild(durationDiv);
  
  // Location row (if available)
  if (detectedLocation) {
    const locationDiv = document.createElement('div');
    locationDiv.style.display = 'flex';
    locationDiv.style.justifyContent = isRTL ? 'flex-end' : 'flex-start';
    
    const locationLabel = document.createElement('span');
    locationLabel.style.fontWeight = 'bold';
    locationLabel.style.marginRight = '8px';
    locationLabel.textContent = isRTL ? 'المكان: ' : 'Location: ';
    
    const locationValue = document.createElement('span');
    locationValue.textContent = detectedLocation;
    
    locationDiv.appendChild(locationLabel);
    locationDiv.appendChild(locationValue);
    metadataDiv.appendChild(locationDiv);
  }
  
  return metadataDiv;
};

/**
 * Process summary content to enhance formatting for PDF export
 * @param content Raw text content
 * @returns HTML formatted content
 */
export const processSummaryContent = (content: string): string => {
  if (!content) return '';
  
  // Process headings
  let processedContent = content.replace(/^(#+)\s+(.+)$/gm, (match, level, text) => {
    const size = 20 - level.length * 2;
    return `<h${level.length} style="font-size: ${size}px; margin-top: 16px; margin-bottom: 8px; font-weight: bold; color: #333;">${text}</h${level.length}>`;
  });
  
  // Process bullet points
  processedContent = processedContent.replace(/^[\s-]*([•\-*])\s+(.+)$/gm, 
    '<div style="display: flex; margin: 4px 0;"><span style="margin-right: 8px;">•</span><span>$2</span></div>');
  
  // Process numbered lists
  processedContent = processedContent.replace(/^(\d+)[\.\)]\s+(.+)$/gm, 
    '<div style="display: flex; margin: 4px 0;"><span style="margin-right: 8px;">$1.</span><span>$2</span></div>');
  
  // Process sections
  processedContent = processedContent.replace(/^(.*?):$/gm, 
    '<div style="font-weight: bold; margin-top: 12px; margin-bottom: 4px; color: #444;">$1:</div>');
  
  // Process bold/italic
  processedContent = processedContent
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Replace newlines with <br>
  processedContent = processedContent.replace(/\n/g, '<br>');
  
  return processedContent;
};
