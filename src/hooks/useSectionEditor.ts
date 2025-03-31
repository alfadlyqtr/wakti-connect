
import { useContext } from "react";
import { SectionEditorContext, useSectionEditor as useEditorFromContext } from "@/components/business/page-builder/section-editors/SectionEditorContext";

// This hook is now just a re-export of the hook from SectionEditorContext
export const useSectionEditor = useEditorFromContext;
