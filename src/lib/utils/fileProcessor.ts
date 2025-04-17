
import { toast } from '@/components/ui/use-toast';

interface ProcessedFile {
  type: 'image' | 'document' | 'pdf' | 'text' | 'unknown';
  preview: string | null;
  file: File;
  content?: string | null; // Extracted text or content
  error?: string | null;
}

// Process different file types
export const processFile = async (file: File): Promise<ProcessedFile> => {
  try {
    const fileType = getFileType(file);
    const preview = await createFilePreview(file);
    
    let content: string | null = null;
    
    // Extract text content if it's a document
    if (fileType === 'document' || fileType === 'pdf' || fileType === 'text') {
      // For now, we'll just return a message - OCR would be implemented here
      content = `Text extraction coming soon for ${file.name}`;
    }
    
    return {
      type: fileType,
      preview,
      file,
      content
    };
  } catch (error) {
    console.error('File processing error:', error);
    toast({
      title: "File Processing Error",
      description: error instanceof Error ? error.message : "Failed to process file",
      variant: "destructive"
    });
    
    return {
      type: 'unknown',
      preview: null,
      file,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Determine file type
const getFileType = (file: File): ProcessedFile['type'] => {
  const mimeType = file.type.toLowerCase();
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (mimeType.startsWith('image/')) return 'image';
  
  if (mimeType === 'application/pdf' || extension === 'pdf') return 'pdf';
  
  if (
    mimeType.includes('document') || 
    mimeType.includes('msword') ||
    mimeType.includes('officedocument') ||
    extension === 'doc' ||
    extension === 'docx' ||
    extension === 'rtf'
  ) return 'document';
  
  if (
    mimeType.includes('text') ||
    extension === 'txt' ||
    extension === 'md'
  ) return 'text';
  
  return 'unknown';
};

// Create preview for file
const createFilePreview = async (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    // For images, create a preview URL
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result.toString());
        } else {
          resolve(null);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, don't create a preview URL
      resolve(null);
    }
  });
};

// Function to read text from files
export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result.toString());
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    } else {
      // For non-text files, just resolve with file name for now
      // In a real app, you would use appropriate libraries for docx, pdf, etc.
      resolve(`[Extracted text from ${file.name} would appear here]`);
    }
  });
};

// Function to generate image thumbnail
export const generateThumbnail = async (file: File, maxWidth = 100, maxHeight = 100): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error('Failed to load image'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // Create thumbnail
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result.toString();
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
