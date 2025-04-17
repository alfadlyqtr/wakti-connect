
/**
 * Process summary content for PDF export
 */

/**
 * Process summary content for PDF export
 * @param summary The markdown summary content
 * @returns Object containing HTML-formatted content and tasks
 */
export const processSummaryContent = (summary: string): { summary: string; tasks: string } => {
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
