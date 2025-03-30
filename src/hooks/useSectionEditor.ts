
import { useContext } from 'react';
import { SectionEditorContext } from '@/components/business/page-builder/section-editors/SectionEditorContext';

/**
 * Hook to access the section editor context
 */
export const useSectionEditor = () => {
  const context = useContext(SectionEditorContext);
  if (!context) {
    throw new Error('useSectionEditor must be used within a SectionEditorProvider');
  }
  return context;
};
