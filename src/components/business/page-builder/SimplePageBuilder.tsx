
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useBusinessPage } from "@/hooks/business-page";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";
import PageBuilderEmptyState from "./PageBuilderEmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PagePreviewTab from "./PagePreviewTab";
import { Separator } from "@/components/ui/separator";
import SectionEditor from "./SectionEditor";
import PageSettingsTab from "./PageSettingsTab";
import { SectionType } from "@/types/business.types";
import { Toast } from "@/components/ui/use-toast";

// Import the SimplePageBuilder component which should now be the primary implementation
import NewSimplePageBuilder from "../page-builder/simple-builder/SimplePageBuilder";

const SimplePageBuilder = () => {
  const navigate = useNavigate();
  
  // Get business page data
  const {
    ownerBusinessPage,
    pageSections = [],
    pageLoading,
    sectionsLoading,
    updatePage,
    createPage,
    updateSection,
    getPublicPageUrl
  } = useBusinessPage();
  
  // Loading state
  const isLoading = pageLoading || sectionsLoading;
  const hasPage = Boolean(ownerBusinessPage);
  
  // State for active section being edited
  const [activeSection, setActiveSection] = useState<BusinessPageSection | null>(null);
  const [activeTab, setActiveTab] = useState<string>("sections");
  
  // Form for updating page settings
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      page_title: ownerBusinessPage?.page_title || "",
      page_slug: ownerBusinessPage?.page_slug || "",
      primary_color: ownerBusinessPage?.primary_color || "#4f46e5",
      description: ownerBusinessPage?.description || ""
    }
  });
  
  // Sync form with loaded data
  useEffect(() => {
    if (ownerBusinessPage) {
      setValue("page_title", ownerBusinessPage.page_title);
      setValue("page_slug", ownerBusinessPage.page_slug);
      setValue("primary_color", ownerBusinessPage.primary_color || "#4f46e5");
      setValue("description", ownerBusinessPage.description || "");
    }
  }, [ownerBusinessPage, setValue]);
  
  // Handler for creating a new page
  const handleCreatePage = async (data: Partial<BusinessPage>) => {
    try {
      await createPage.mutateAsync(data);
      // After successful creation, navigate to the builder page
      // This stays within the same component but will trigger a reload
      // navigate("/dashboard/business-page");
    } catch (err) {
      console.error("Error creating page:", err);
    }
  };
  
  // Handler for updating section content
  const handleUpdateSection = async (section: BusinessPageSection) => {
    try {
      await updateSection.mutateAsync({
        sectionId: section.id,
        data: {
          section_content: section.section_content,
          section_order: section.section_order,
          section_type: section.section_type
        }
      });
    } catch (err) {
      console.error("Error updating section:", err);
    }
  };
  
  // Use the new SimplePageBuilder component which has all the functionality
  return <NewSimplePageBuilder />;
};

export default SimplePageBuilder;
