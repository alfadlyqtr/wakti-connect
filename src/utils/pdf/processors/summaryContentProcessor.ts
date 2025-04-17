
/**
 * Process meeting summary content for PDF generation
 */

/**
 * Processes summary content to extract tasks and format the content
 * @param summary The raw summary text
 * @returns Object containing processed summary and extracted tasks
 */
export const processSummaryContent = (summary: string) => {
  // Extract task list if present
  const taskListMatch = summary.match(/(?:## Task|## Action|## To-Do)[\s\S]*$/i);
  const tasks = taskListMatch ? taskListMatch[0] : null;
  
  // Remove tasks from main summary if extracted separately
  let processedSummary = tasks 
    ? summary.substring(0, summary.indexOf(taskListMatch[0])).trim()
    : summary;
  
  // Format markdown headings for PDF
  processedSummary = processedSummary
    .replace(/^# (.*)/gm, '<<strong>$1</strong>>')
    .replace(/^## (.*)/gm, '<<strong>$1</strong>>')
    .replace(/^### (.*)/gm, '<<strong>$1</strong>>');
  
  // Format bullet points
  processedSummary = processedSummary
    .replace(/^\* (.*)/gm, '• $1')
    .replace(/^- (.*)/gm, '• $1');
  
  // Format bold text
  processedSummary = processedSummary
    .replace(/\*\*(.*?)\*\*/g, '<<strong>$1</strong>>');
  
  // Convert temporary tags back to HTML
  processedSummary = processedSummary
    .replace(/<<strong>(.*?)<\/strong>>/g, '<strong>$1</strong>');
  
  // Support for Arabic text direction
  if (/[\u0600-\u06FF]/.test(processedSummary)) {
    // Add direction attributes for mixed content
    processedSummary = processedSummary
      .replace(/([\u0600-\u06FF].+?)(?=\n|$)/g, '<span dir="rtl">$1</span>');
  }
  
  return {
    summary: processedSummary,
    tasks
  };
};
