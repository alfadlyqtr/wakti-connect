
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessPageDataRecord } from "./useBusinessPageDataMutations";
import { BusinessPageData } from "@/components/business/page-builder/context/BusinessPageContext";
import { Json } from "@/types/supabase";

// Fetch business page data for the current user
export const useBusinessPageDataQuery = (userId?: string) => {
  return useQuery({
    queryKey: ['businessPageData', userId],
    queryFn: async () => {
      if (!userId) {
        console.log("No user ID provided for business page data query");
        return null;
      }
      
      console.log("Fetching business page data for user:", userId);
      
      // First, get the user's business name from their profile
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('business_name, full_name')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.warn("Error fetching user profile:", profileError);
      }
      
      const businessNameFromProfile = userProfile?.business_name || userProfile?.full_name || null;
      console.log("Business name from profile:", businessNameFromProfile);
      
      // Now get their business page data
      const { data, error } = await supabase
        .from('business_pages_data')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching business page data:", error);
        throw error;
      }
      
      console.log("Fetched business page data:", data);
      
      if (!data) {
        // If no data exists, generate default with the business name from profile
        const defaultPageData: BusinessPageData = {
          pageSetup: {
            businessName: businessNameFromProfile || "My Business",
            alignment: "center",
            visible: true
          },
          logo: { url: "", shape: "circle", alignment: "center", visible: true },
          bookings: { viewStyle: "grid", templates: [], visible: true },
          socialInline: { 
            style: "icon", 
            platforms: {
              whatsapp: false,
              whatsappBusiness: false,
              facebook: false,
              instagram: false,
              googleMaps: false,
              phone: false,
              email: false
            },
            visible: true
          },
          workingHours: { 
            layout: "card", 
            hours: [], 
            visible: true
          },
          chatbot: { 
            position: "right", 
            embedCode: "", 
            visible: false
          },
          theme: {
            backgroundColor: "#ffffff",
            textColor: "#000000",
            fontStyle: "sans-serif"
          },
          socialSidebar: { 
            position: "right", 
            platforms: {
              whatsapp: false,
              whatsappBusiness: false,
              facebook: false,
              instagram: false,
              googleMaps: false,
              phone: false,
              email: false
            },
            visible: false
          },
          contactInfo: {
            email: "",
            whatsapp: "",
            whatsappBusiness: "",
            phone: "",
            facebook: "",
            googleMaps: "",
            instagram: ""
          },
          sectionOrder: ["pageSetup", "logo", "bookings", "socialInline", "workingHours"],
          published: false
        };
        
        console.log("Created default page data with businessName:", defaultPageData.pageSetup.businessName);
        return null;
      }
      
      try {
        // Convert the JSON page_data back to BusinessPageData type
        const pageData = data.page_data as unknown as BusinessPageData;
        
        // Ensure pageSetup exists and has default values if needed
        if (!pageData.pageSetup) {
          pageData.pageSetup = {
            businessName: businessNameFromProfile || "My Business",
            alignment: "center",
            visible: true
          };
        } else if (!pageData.pageSetup.businessName && businessNameFromProfile) {
          // If we have a business name from the profile but none in the page data, use it
          pageData.pageSetup.businessName = businessNameFromProfile;
        }
        
        // Log the processed data
        console.log("Processed business page data:", {
          id: data.id,
          pageSlug: data.page_slug,
          pageSetup: pageData.pageSetup
        });
        
        return {
          ...data,
          page_data: pageData
        } as BusinessPageDataRecord;
      } catch (parseError) {
        console.error("Error processing page data:", parseError);
        throw new Error("Failed to process page data");
      }
    },
    enabled: !!userId
  });
};
