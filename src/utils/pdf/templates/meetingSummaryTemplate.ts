
/**
 * Template for meeting summary PDF
 */

import { formatTime } from '../helpers/timeFormatters';

/**
 * Creates the meeting summary HTML template for PDF exports
 */
export const createMeetingSummaryTemplate = (
  summary: string,
  recordingTime: number,
  detectedLocation: string | null,
  formattedSummary: string,
  tasks: string
): string => {
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
