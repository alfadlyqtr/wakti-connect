
// This hook has been deprecated as the business page feature has been removed

export const useBusinessPage = () => {
  return {
    businessPage: null,
    isLoading: false,
    pageSections: [],
    socialLinks: [],
    contactSubmissions: [],
    submissionsLoading: false,
    refetchSubmissions: () => Promise.resolve(),
    markSubmissionAsRead: { mutateAsync: () => Promise.resolve(null) },
    ownerBusinessPage: null,
    ownerPageLoading: false,
    createPage: { mutateAsync: () => Promise.resolve(null) },
    updatePage: { mutateAsync: () => Promise.resolve(null) },
    updateSection: { mutateAsync: () => Promise.resolve(null) },
    submitContactForm: { mutateAsync: () => Promise.resolve(null) },
    autoSavePage: () => {},
    autoSaveField: () => {},
    getPublicPageUrl: () => "#",
  };
};
