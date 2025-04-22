
/**
 * Format the recording duration in mm:ss format
 */
export const formatRecordingDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculate the recording progress percentage
 */
export const calculateRecordingProgress = (currentTime: number, maxTime: number): number => {
  return Math.min((currentTime / maxTime) * 100, 100);
};

/**
 * Formats a transcript with proper RTL for Arabic text
 */
export const formatTranscriptWithRTL = (text: string): JSX.Element => {
  // Split the text by paragraphs
  const paragraphs = text.split('\n');
  
  return (
    <>
      {paragraphs.map((paragraph, idx) => {
        // Check if paragraph contains Arabic script
        const isArabic = /[\u0600-\u06FF]/.test(paragraph);
        
        return (
          <p 
            key={idx} 
            dir={isArabic ? "rtl" : "ltr"} 
            className={isArabic ? "text-right font-arabic" : "text-left"}
            style={{ textAlign: isArabic ? "right" : "left" }}
          >
            {paragraph}
          </p>
        );
      })}
    </>
  );
};

/**
 * Determines if text contains Arabic characters
 */
export const containsArabic = (text: string): boolean => {
  return /[\u0600-\u06FF]/.test(text);
};
