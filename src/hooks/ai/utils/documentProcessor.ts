
/**
 * Document processing utilities for the AI assistant
 * These functions handle document uploads, text extraction,
 * and context preparation for AI interactions
 */

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface ProcessedDocument {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: Date;
}

/**
 * Process a file and extract text/content for AI context
 */
export async function processDocument(file: File): Promise<ProcessedDocument | null> {
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: "File too large",
      description: "Please upload a file smaller than 5MB",
      variant: "destructive"
    });
    return null;
  }
  
  // Get file extension
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  
  // Process based on file type
  try {
    // For text files, simply read the text
    if (fileExt === 'txt' || file.type.includes('text/plain')) {
      const text = await file.text();
      
      return {
        id: crypto.randomUUID(),
        title: file.name,
        content: text.slice(0, 100000), // Limit to 100K chars
        type: 'text',
        createdAt: new Date()
      };
    }
    
    // For PDFs, we need to extract text server-side (not implemented here)
    if (fileExt === 'pdf' || file.type.includes('application/pdf')) {
      // Upload to temporary storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ai-document-processing')
        .upload(`temp/${crypto.randomUUID()}-${file.name}`, file);
        
      if (uploadError) {
        console.error("Error uploading document:", uploadError);
        toast({
          title: "Upload Failed",
          description: "Couldn't upload your document for processing",
          variant: "destructive"
        });
        return null;
      }
      
      toast({
        title: "Document Uploaded",
        description: "PDF processing is coming soon! For now, we've extracted basic information.",
        variant: "default"
      });
      
      // Since we can't extract PDF text client-side easily, return a placeholder
      return {
        id: crypto.randomUUID(),
        title: file.name,
        content: "This is a PDF document. Please ask questions about it, and I'll try to help based on what you tell me about its contents.",
        type: 'pdf',
        createdAt: new Date()
      };
    }
    
    // For images, we'd need OCR (not implemented here)
    if (fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'png' || file.type.includes('image/')) {
      toast({
        title: "Image Received",
        description: "Image text extraction is coming soon! For now, please describe what's in the image.",
        variant: "default"
      });
      
      return {
        id: crypto.randomUUID(),
        title: file.name,
        content: "This is an image. Please describe what's in the image so I can assist you better.",
        type: 'image',
        createdAt: new Date()
      };
    }
    
    // For unsupported file types
    toast({
      title: "Unsupported File Type",
      description: "We currently support text files, PDFs, and images.",
      variant: "destructive"
    });
    
    return null;
  } catch (error) {
    console.error("Error processing document:", error);
    toast({
      title: "Processing Error",
      description: "There was a problem processing your document",
      variant: "destructive"
    });
    return null;
  }
}

/**
 * Store a processed document in the database
 */
export async function saveProcessedDocument(userId: string, document: ProcessedDocument): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('ai_document_context')
      .insert({
        user_id: userId,
        title: document.title,
        content: document.content,
        document_type: document.type
      })
      .select('id')
      .single();
      
    if (error) {
      console.error("Error saving document:", error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error("Error in saveProcessedDocument:", error);
    return null;
  }
}

/**
 * Get all documents for a user
 */
export async function getUserDocuments(userId: string): Promise<ProcessedDocument[]> {
  try {
    const { data, error } = await supabase
      .from('ai_document_context')
      .select('id, title, content, document_type, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
    
    return data.map(doc => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      type: doc.document_type,
      createdAt: new Date(doc.created_at)
    }));
  } catch (error) {
    console.error("Error in getUserDocuments:", error);
    return [];
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(documentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('ai_document_context')
      .delete()
      .eq('id', documentId);
      
    if (error) {
      console.error("Error deleting document:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteDocument:", error);
    return false;
  }
}
