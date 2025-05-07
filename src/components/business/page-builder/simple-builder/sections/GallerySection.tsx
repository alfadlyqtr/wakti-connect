
import React, { useState } from "react";
import { SectionType } from "../types";
import { Loader2, Plus, Image, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { uploadBusinessImage } from "@/services/profile/updateProfileService";

interface GallerySectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ section, isActive, onClick }) => {
  const [uploading, setUploading] = useState(false);
  
  // Get gallery images from section content
  const galleryImages = section.content?.images || [];
  const layout = section.content?.layout || "grid";
  const columns = section.content?.columns || 3;
  const showCaption = section.content?.showCaption || false;
  
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
      
      // Upload the image using the service
      const imageUrl = await uploadBusinessImage(businessId, file, 'gallery');
      
      toast({
        title: "Image uploaded successfully",
        description: "Your gallery image has been added"
      });
      
      // Create a new images array with the uploaded image
      const newImage = {
        url: imageUrl,
        alt: file.name.split('.')[0].replace(/[_-]/g, ' '),
        caption: ''
      };
      
      // Update the section with the new image
      // Note: This would need to be connected to the section update functionality
      console.log("Image uploaded:", newImage);
      
      return imageUrl;
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
  
  const renderGalleryLayout = () => {
    if (galleryImages.length === 0) {
      // If no images, show placeholders based on columns
      return (
        <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-200 aspect-square flex items-center justify-center">
              <Image className="h-8 w-8 text-gray-400" />
            </div>
          ))}
        </div>
      );
    }
    
    switch (layout) {
      case "cards":
        return (
          <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
            {galleryImages.map((image: any, index: number) => (
              <div key={index} className="group rounded-lg overflow-hidden bg-white shadow-md">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.alt || `Gallery image ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                </div>
                
                {showCaption && image.caption && (
                  <div className="p-4">
                    <h3 className="font-medium">{image.alt || `Image ${index + 1}`}</h3>
                    <p className="text-sm text-gray-500 mt-1">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        
      case "masonry":
        return (
          <div className={`columns-${columns} gap-4 space-y-4`}>
            {galleryImages.map((image: any, index: number) => (
              <div key={index} className="break-inside-avoid">
                <img 
                  src={image.url} 
                  alt={image.alt || `Gallery image ${index + 1}`} 
                  className="w-full rounded-lg"
                />
                {showCaption && image.caption && (
                  <div className="mt-2 mb-4">
                    <p className="text-sm text-gray-500">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        
      default: // grid layout
        return (
          <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
            {galleryImages.map((image: any, index: number) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-sm group relative">
                <img 
                  src={image.url} 
                  alt={image.alt || `Gallery image ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                />
                {showCaption && image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
    }
  };
  
  return (
    <div 
      className={`relative transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-2 text-center">{section.title || section.content?.title || "Gallery"}</h2>
        <p className="text-gray-600 mb-8 text-center">{section.subtitle || section.content?.description || "View our work"}</p>
        
        {renderGalleryLayout()}
        
        {isActive && galleryImages.length === 0 && (
          <div className="mt-4 flex justify-center">
            <div className="text-center max-w-md">
              <AlertCircle className="h-8 w-8 mx-auto text-amber-500 mb-2" />
              <p className="text-sm text-gray-500">
                No images have been added to this gallery yet. Use the editor panel to upload images.
              </p>
            </div>
          </div>
        )}
        
        {isActive && (
          <div className="mt-6 flex justify-center">
            <input
              type="file"
              id="gallery-upload"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/webp,image/gif"
            />
            <label htmlFor="gallery-upload" className="cursor-pointer flex items-center px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Add Image</span>
                </>
              )}
            </label>
          </div>
        )}
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
