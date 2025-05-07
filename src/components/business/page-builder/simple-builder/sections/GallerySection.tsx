
import React, { useState } from "react";
import { SectionType } from "../types";
import { Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface GallerySectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ section, isActive, onClick }) => {
  const [uploading, setUploading] = useState(false);
  
  // Get gallery images from section content
  const galleryImages = section.content?.images || [];
  
  // Function to handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to upload images");
      }
      
      const businessId = session.user.id;
      const file = files[0];
      
      // Validate file size (5MB max)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        throw new Error("File size must be less than 5MB");
      }
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${businessId}/gallery/${fileName}`;
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath);
        
      toast({
        title: "Image uploaded successfully",
        description: "Your gallery image has been added"
      });
      
      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong"
      });
      return null;
    } finally {
      setUploading(false);
      // Clear input value so the same file can be selected again
      e.target.value = '';
    }
  };
  
  // Placeholder for now - this would be replaced by actual images in production
  const placeholderCount = Math.max(6, galleryImages.length);
  
  return (
    <div 
      className={`relative transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      <div className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{section.title || "Gallery"}</h2>
        <p className="text-gray-600 mb-8">{section.subtitle || "View our work"}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Display actual images if available, otherwise placeholders */}
          {galleryImages.length > 0 ? (
            galleryImages.map((image, i) => (
              <div key={i} className="bg-gray-100 h-40 relative">
                <img 
                  src={image.url} 
                  alt={image.alt || `Gallery image ${i+1}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))
          ) : (
            Array(placeholderCount).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-200 h-40 flex items-center justify-center">
                <span className="text-gray-500">Gallery image {i + 1}</span>
              </div>
            ))
          )}
          
          {isActive && (
            <div className="bg-gray-100 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer">
              <input
                type="file"
                id="gallery-upload"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/webp,image/gif"
              />
              <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-500 mt-2">Add image</span>
                  </>
                )}
              </label>
            </div>
          )}
        </div>
      </div>
      
      {isActive && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
          Editing
        </div>
      )}
    </div>
  );
};

export default GallerySection;
