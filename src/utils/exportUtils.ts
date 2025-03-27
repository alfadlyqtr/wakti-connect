
/**
 * Utility function to export data to CSV file
 */
export const exportToCSV = (data: Record<string, any>[], filename: string) => {
  // Handle empty data
  if (!data || !data.length) {
    console.error('No data to export');
    return;
  }
  
  try {
    // Get headers from the first object's keys
    const headers = Object.keys(data[0]);
    
    // Create CSV rows
    const csvRows = [];
    
    // Add the headers
    csvRows.push(headers.join(','));
    
    // Add the data rows
    for (const row of data) {
      const values = headers.map(header => {
        const cellValue = row[header];
        // Handle values with commas by surrounding with quotes
        return typeof cellValue === 'string' && cellValue.includes(',') 
          ? `"${cellValue}"` 
          : cellValue;
      });
      
      csvRows.push(values.join(','));
    }
    
    // Combine into a CSV string
    const csvString = csvRows.join('\n');
    
    // Create a blob
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting data to CSV:', error);
  }
};

/**
 * Utility function to export data as JSON file
 */
export const exportToJSON = (data: any, filename: string) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.json`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting data to JSON:', error);
  }
};
