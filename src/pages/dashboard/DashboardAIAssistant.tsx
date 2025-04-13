import React, { useState, useEffect, useCallback } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/mode-toggle";
import { useToast } from "@/components/ui/use-toast";
import { useProModal } from "@/hooks/use-pro-modal";
import { TaskConfirmationCard } from "@/components/ai/task/TaskConfirmationCard";
import { AIAssistantDocumentsCard } from "@/components/ai/AIAssistantDocumentsCard";
import { CleanChatInterface } from "@/components/ai/assistant/CleanChatInterface";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { ParsedTaskInfo } from "@/hooks/ai/utils/taskParser.types";
import { TaskFormData } from "@/types/task.types";

const DashboardAIAssistant = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("normal");
  const [enableSubtasks, setEnableSubtasks] = useState(false);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState([5]);
  const [selectedRole, setSelectedRole] = useState<AIAssistantRole>("general");
  const [inputMessage, setInputMessage] = useState("");
  const [userName, setUserName] = useState("User");
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [processingVoice, setProcessingVoice] = useState(false);
  const [temporaryTranscript, setTemporaryTranscript] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isDocumentAnalysisOpen, setIsDocumentAnalysisOpen] = useState(false);
  const [documentContent, setDocumentContent] = useState("");
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [knowledgeBaseContent, setKnowledgeBaseContent] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsContent, setSettingsContent] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpContent, setHelpContent] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [integrationsContent, setIntegrationsContent] = useState("");
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [aboutContent, setAboutContent] = useState("");
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [teamContent, setTeamContent] = useState("");
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [pricingContent, setPricingContent] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactContent, setContactContent] = useState("");
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [termsContent, setTermsContent] = useState("");
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [privacyContent, setPrivacyContent] = useState("");
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [securityContent, setSecurityContent] = useState("");
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [accessibilityContent, setAccessibilityContent] = useState("");
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [creditsContent, setCreditsContent] = useState("");
  const [isDonationsOpen, setIsDonationsOpen] = useState(false);
  const [donationsContent, setDonationsContent] = useState("");
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportContent, setSupportContent] = useState("");
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [communityContent, setCommunityContent] = useState("");
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [socialContent, setSocialContent] = useState("");
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [blogContent, setBlogContent] = useState("");
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [newsContent, setNewsContent] = useState("");
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [eventsContent, setEventsContent] = useState("");
  const [isWebinarsOpen, setIsWebinarsOpen] = useState(false);
  const [webinarsContent, setWebinarsContent] = useState("");
  const [isPodcastOpen, setIsPodcastOpen] = useState(false);
  const [podcastContent, setPodcastContent] = useState("");
  const [isVideosOpen, setIsVideosOpen] = useState(false);
  const [videosContent, setVideosContent] = useState("");
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);
  const [downloadsContent, setDownloadsContent] = useState("");
  const [isAPIOpen, setIsAPIOpen] = useState(false);
  const [apiContent, setApiContent] = useState("");
  const [isSDKOpen, setIsSDKOpen] = useState(false);
  const [sdkContent, setSdkContent] = useState("");
  const [isPluginsOpen, setIsPluginsOpen] = useState(false);
  const [pluginsContent, setPluginsContent] = useState("");
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const [themesContent, setThemesContent] = useState("");
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [templatesContent, setTemplatesContent] = useState("");
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);
  const [examplesContent, setExamplesContent] = useState("");
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [showcaseContent, setShowcaseContent] = useState("");
  const [isCustomersOpen, setIsCustomersOpen] = useState(false);
  const [customersContent, setCustomersContent] = useState("");
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
  const [partnersContent, setPartnersContent] = useState("");
  const [isAffiliatesOpen, setIsAffiliatesOpen] = useState(false);
  const [affiliatesContent, setAffiliatesContent] = useState("");
  const [isResellersOpen, setIsResellersOpen] = useState(false);
  const [resellersContent, setResellersContent] = useState("");
  const [isDistributorsOpen, setIsDistributorsOpen] = useState(false);
  const [distributorsContent, setDistributorsContent] = useState("");
  const [isCareersOpen, setIsCareersOpen] = useState(false);
  const [careersContent, setCareersContent] = useState("");
  const [isJobsOpen, setIsJobsOpen] = useState(false);
  const [jobsContent, setJobsContent] = useState("");
  const [isInternshipsOpen, setIsInternshipsOpen] = useState(false);
  const [internshipsContent, setInternshipsContent] = useState("");
  const [isVolunteeringOpen, setIsVolunteeringOpen] = useState(false);
  const [volunteeringContent, setVolunteeringContent] = useState("");
  const [isSponsorshipsOpen, setIsSponsorshipsOpen] = useState(false);
  const [sponsorshipsContent, setSponsorshipsContent] = useState("");
  const [isAdvertisingOpen, setIsAdvertisingOpen] = useState(false);
  const [advertisingContent, setAdvertisingContent] = useState("");
  const [isPressOpen, setIsPressOpen] = useState(false);
  const [pressContent, setPressContent] = useState("");
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [mediaContent, setMediaContent] = useState("");
  const [isInvestorsOpen, setIsInvestorsOpen] = useState(false);
  const [investorsContent, setInvestorsContent] = useState("");
  const [isGovernanceOpen, setIsGovernanceOpen] = useState(false);
  const [governanceContent, setGovernanceContent] = useState("");
  const [isEthicsOpen, setIsEthicsOpen] = useState(false);
  const [ethicsContent, setEthicsContent] = useState("");
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [complianceContent, setComplianceContent] = useState("");
  const [isCertificationsOpen, setIsCertificationsOpen] = useState(false);
  const [certificationsContent, setCertificationsContent] = useState("");
  const [isAwardsOpen, setIsAwardsOpen] = useState(false);
  const [awardsContent, setAwardsContent] = useState("");
  const [isRecognitionOpen, setIsRecognitionOpen] = useState(false);
  const [recognitionContent, setRecognitionContent] = useState("");
  const [isTestimonialsOpen, setIsTestimonialsOpen] = useState(false);
  const [testimonialsContent, setTestimonialsContent] = useState("");
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [reviewsContent, setReviewsContent] = useState("");
  const [isCaseStudiesOpen, setIsCaseStudiesOpen] = useState(false);
  const [caseStudiesContent, setCaseStudiesContent] = useState("");
  const [isWhitePapersOpen, setIsWhitePapersOpen] = useState(false);
  const [whitePapersContent, setWhitePapersContent] = useState("");
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [reportsContent, setReportsContent] = useState("");
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);
  const [statisticsContent, setStatisticsContent] = useState("");
  const [isSurveysOpen, setIsSurveysOpen] = useState(false);
  const [surveysContent, setSurveysContent] = useState("");
  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const [researchContent, setResearchContent] = useState("");
  const [isDataOpen, setIsDataOpen] = useState(false);
  const [dataContent, setDataContent] = useState("");
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsContent, setAnalyticsContent] = useState("");
  const [isTrendsOpen, setIsTrendsOpen] = useState(false);
  const [trendsContent, setTrendsContent] = useState("");
  const [isForecastsOpen, setIsForecastsOpen] = useState(false);
  const [forecastsContent, setForecastsContent] = useState("");
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [insightsContent, setInsightsContent] = useState("");
  const [isPredictionsOpen, setIsPredictionsOpen] = useState(false);
  const [predictionsContent, setPredictionsContent] = useState("");
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [recommendationsContent, setRecommendationsContent] = useState("");
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [personalizationContent, setPersonalizationContent] = useState("");
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [customizationContent, setCustomizationContent] = useState("");
  const [isAutomationOpen, setIsAutomationOpen] = useState(false);
  const [automationContent, setAutomationContent] = useState("");
  const [isOptimizationOpen, setIsOptimizationOpen] = useState(false);
  const [optimizationContent, setOptimizationContent] = useState("");
  const [isEfficiencyOpen, setIsEfficiencyOpen] = useState(false);
  const [efficiencyContent, setEfficiencyContent] = useState("");
  const [isEffectivenessOpen, setIsEffectivenessOpen] = useState(false);
  const [effectivenessContent, setEffectivenessContent] = useState("");
  const [isInnovationOpen, setIsInnovationOpen] = useState(false);
  const [innovationContent, setInnovationContent] = useState("");
  const [isCreativityOpen, setIsCreativityOpen] = useState(false);
  const [creativityContent, setCreativityContent] = useState("");
  const [isImaginationOpen, setIsImaginationOpen] = useState(false);
  const [imaginationContent, setImaginationContent] = useState("");
  const [isInspirationOpen, setIsInspirationOpen] = useState(false);
  const [inspirationContent, setInspirationContent] = useState("");
  const [isMotivationOpen, setIsMotivationOpen] = useState(false);
  const [motivationContent, setMotivationContent] = useState("");
  const [isEngagementOpen, setIsEngagementOpen] = useState(false);
  const [engagementContent, setEngagementContent] = useState("");
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [experienceContent, setExperienceContent] = useState("");
  const [isSatisfactionOpen, setIsSatisfactionOpen] = useState(false);
  const [satisfactionContent, setSatisfactionContent] = useState("");
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [loyaltyContent, setLoyaltyContent] = useState("");
  const [isAdvocacyOpen, setIsAdvocacyOpen] = useState(false);
  const [advocacyContent, setAdvocacyContent] = useState("");
  const [isRetentionOpen, setIsRetentionOpen] = useState(false);
  const [retentionContent, setRetentionContent] = useState("");
  const [isGrowthOpen, setIsGrowthOpen] = useState(false);
  const [growthContent, setGrowthContent] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successContent, setSuccessContent] = useState("");
  const { toast } = useToast();
  const proModal = useProModal();

  const {
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation,
    aiSettings,
    isLoadingSettings,
    updateSettings,
    canUseAI,
    addKnowledge,
    knowledgeUploads,
    isLoadingKnowledge,
    deleteKnowledge,
    storeCurrentRole
  } = useAIAssistant();

  useEffect(() => {
    storeCurrentRole(selectedRole);
  }, [selectedRole, storeCurrentRole]);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const handleTaskDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTaskDescription(e.target.value);
  };

  const handleTaskPriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskPriority(e.target.value);
  };

  const handleEnableSubtasksChange = (checked: boolean) => {
    setEnableSubtasks(checked);
  };

  const handleSubtaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubtaskInput(e.target.value);
  };

  const handleAddSubtask = () => {
    if (subtaskInput.trim() !== "") {
      setSubtasks([...subtasks, subtaskInput.trim()]);
      setSubtaskInput("");
    }
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
  };

  const handleRoleChange = (role: AIAssistantRole) => {
    setSelectedRole(role);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    try {
      await sendMessage(inputMessage);
      setInputMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error Sending Message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearChat = () => {
    clearMessages();
  };

  const handleConfirmTask = () => {
    if (detectedTask) {
      // Convert TaskFormData to ParsedTaskInfo
      const parsedTaskInfo: ParsedTaskInfo = {
        title: detectedTask.title,
        description: detectedTask.description,
        priority: detectedTask.priority || 'normal', // Ensure priority is always defined
        subtasks: detectedTask.originalSubtasks || [],
        due_date: detectedTask.due_date,
        dueTime: detectedTask.due_time,
        location: detectedTask.location,
        hasTimeConstraint: false,
        needsReview: false
      };
      
      // Call confirmCreateTask with the properly typed parsedTaskInfo
      confirmCreateTask(detectedTask);
    }
  };

  const handleCancelTask = () => {
    cancelCreateTask();
  };

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file.name);
  };

  const handleStartVoiceInput = () => {
    setIsListening(true);
  };

  const handleStopVoiceInput = () => {
    setIsListening(false);
    setProcessingVoice(true);
    setTimeout(() => {
      setProcessingVoice(false);
      setTemporaryTranscript("This is a temporary transcript from voice input.");
    }, 2000);
  };

  const handleConfirmTranscript = () => {
    setInputMessage(temporaryTranscript || "");
    setTemporaryTranscript(null);
  };

  const handleCameraCapture = () => {
    setIsCameraOpen(true);
    setTimeout(() => {
      setCapturedImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+r8jUAAAP//Sz5aES4AAAAASUVORK5CYII=");
      setIsCameraOpen(false);
    }, 3000);
  };

  const handleDocumentAnalysis = () => {
    setIsDocumentAnalysisOpen(true);
    setTimeout(() => {
      setDocumentContent("This is the content extracted from the document.");
      setIsDocumentAnalysisOpen(false);
    }, 3000);
  };

  const handleKnowledgeBase = () => {
    setIsKnowledgeBaseOpen(true);
    setTimeout(() => {
      setKnowledgeBaseContent("This is the content from the knowledge base.");
      setIsKnowledgeBaseOpen(false);
    }, 3000);
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
    setTimeout(() => {
      setSettingsContent("These are the settings for the AI assistant.");
      setIsSettingsOpen(false);
    }, 3000);
  };

  const handleHelp = () => {
    setIsHelpOpen(true);
    setTimeout(() => {
      setHelpContent("This is the help content for the AI assistant.");
      setIsHelpOpen(false);
    }, 3000);
  };

  const handleFeedback = () => {
    setIsFeedbackOpen(true);
    setTimeout(() => {
      setFeedbackContent("This is the feedback content for the AI assistant.");
      setIsFeedbackOpen(false);
    }, 3000);
  };

  const handleIntegrations = () => {
    setIsIntegrationsOpen(true);
    setTimeout(() => {
      setIntegrationsContent("These are the integrations for the AI assistant.");
      setIsIntegrationsOpen(false);
    }, 3000);
  };

  const handleAbout = () => {
    setIsAboutOpen(true);
    setTimeout(() => {
      setAboutContent("This is the about content for the AI assistant.");
      setIsAboutOpen(false);
    }, 3000);
  };

  const handleTeam = () => {
    setIsTeamOpen(true);
    setTimeout(() => {
      setTeamContent("This is the team content for the AI assistant.");
      setIsTeamOpen(false);
    }, 3000);
  };

  const handlePricing = () => {
    setIsPricingOpen(true);
    setTimeout(() => {
      setPricingContent("This is the pricing content for the AI assistant.");
      setIsPricingOpen(false);
    }, 3000);
  };

  const handleContact = () => {
    setIsContactOpen(true);
    setTimeout(() => {
      setContactContent("This is the contact content for the AI assistant.");
      setIsContactOpen(false);
    }, 3000);
  };

  const handleTerms = () => {
    setIsTermsOpen(true);
    setTimeout(() => {
      setTermsContent("These are the terms and conditions for the AI assistant.");
      setIsTermsOpen(false);
    }, 3000);
  };

  const handlePrivacy = () => {
    setIsPrivacyOpen(true);
    setTimeout(() => {
      setPrivacyContent("This is the privacy policy for the AI assistant.");
      setIsPrivacyOpen(false);
    }, 3000);
  };

  const handleSecurity = () => {
    setIsSecurityOpen(true);
    setTimeout(() => {
      setSecurityContent("This is the security information for the AI assistant.");
      setIsSecurityOpen(false);
    }, 3000);
  };

  const handleAccessibility = () => {
    setIsAccessibilityOpen(true);
    setTimeout(() => {
      setAccessibilityContent("This is the accessibility information for the AI assistant.");
      setIsAccessibilityOpen(false);
    }, 3000);
  };

  const handleCredits = () => {
    setIsCreditsOpen(true);
    setTimeout(() => {
      setCreditsContent("These are the credits for the AI assistant.");
      setIsCreditsOpen(false);
    }, 3000);
  };

  const handleDonations = () => {
    setIsDonationsOpen(true);
    setTimeout(() => {
      setDonationsContent("This is the donations information for the AI assistant.");
      setIsDonationsOpen(false);
    }, 3000);
  };

  const handleSupport = () => {
    setIsSupportOpen(true);
    setTimeout(() => {
      setSupportContent("This is the support content for the AI assistant.");
      setIsSupportOpen(false);
    }, 3000);
  };

  const handleCommunity = () => {
    setIsCommunityOpen(true);
    setTimeout(() => {
      setCommunityContent("This is the community content for the AI assistant.");
      setIsCommunityOpen(false);
    }, 3000);
  };

  const handleSocial = () => {
    setIsSocialOpen(true);
    setTimeout(() => {
      setSocialContent("This is the social content for the AI assistant.");
      setIsSocialOpen(false);
    }, 3000);
  };

  const handleBlog = () => {
    setIsBlogOpen(true);
    setTimeout(() => {
      setBlogContent("This is the blog content for the AI assistant.");
      setIsBlogOpen(false);
    }, 3000);
  };

  const handleNews = () => {
    setIsNewsOpen(true);
    setTimeout(() => {
      setNewsContent("This is the news content for the AI assistant.");
      setIsNewsOpen(false);
    }, 3000);
  };

  const handleEvents = () => {
    setIsEventsOpen(true);
    setTimeout(() => {
      setEventsContent("This is the events content for the AI assistant.");
      setIsEventsOpen(false);
    }, 3000);
  };

  const handleWebinars = () => {
    setIsWebinarsOpen(true);
    setTimeout(() => {
      setWebinarsContent("This is the webinars content for the AI assistant.");
      setIsWebinarsOpen(false);
    }, 3000);
  };

  const handlePodcast = () => {
    setIsPodcastOpen(true);
    setTimeout(() => {
      setPodcastContent("This is the podcast content for the AI assistant.");
      setIsPodcastOpen(false);
    }, 3000);
  };

  const handleVideos = () => {
    setIsVideosOpen(true);
    setTimeout(() => {
      setVideosContent("This is the videos content for the AI assistant.");
      setIsVideosOpen(false);
    }, 3000);
  };

  const handleDownloads = () => {
    setIsDownloadsOpen(true);
    setTimeout(() => {
      setDownloadsContent("This is the downloads content for the AI assistant.");
      setIsDownloadsOpen(false);
    }, 3000);
  };

  const handleAPI = () => {
    setIsAPIOpen(true);
    setTimeout(() => {
      setApiContent("This is the API content for the AI assistant.");
      setIsAPIOpen(false);
    }, 3000);
  };

  const handleSDK = () => {
    setIsSDKOpen(true);
    setTimeout(() => {
      setSdkContent("This is the SDK content for the AI assistant.");
      setIsSDKOpen(false);
    }, 3000);
  };

  const handlePlugins = () => {
    setIsPluginsOpen(true);
    setTimeout(() => {
      setPluginsContent("This is the plugins content for the AI assistant.");
      setIsPluginsOpen(false);
    }, 3000);
  };

  const handleThemes = () => {
    setIsThemesOpen(true);
    setTimeout(() => {
      setThemesContent("This is the themes content for the AI assistant.");
      setIsThemesOpen(false);
    }, 3000);
  };

  const handleTemplates = () => {
    setIsTemplatesOpen(true);
    setTimeout(() => {
      setTemplatesContent("This is the templates content for the AI assistant.");
      setIsTemplatesOpen(false);
    }, 3000);
  };

  const handleExamples = () => {
    setIsExamplesOpen(true);
    setTimeout(() => {
      setExamplesContent("This is the examples content for the AI assistant.");
      setIsExamplesOpen(false);
    }, 3000);
  };

  const handleShowcase = () => {
    setIsShowcaseOpen(true);
    setTimeout(() => {
      setShowcaseContent("This is the showcase content for the AI assistant.");
      setIsShowcaseOpen(false);
    }, 3000);
  };

  const handleCustomers = () => {
    setIsCustomersOpen(true);
    setTimeout(() => {
      setCustomersContent("This is the customers content for the AI assistant.");
      setIsCustomersOpen(false);
    }, 3000);
  };

  const handlePartners = () => {
    setIsPartnersOpen(true);
    setTimeout(() => {
      setPartnersContent("This is the partners content for the AI assistant.");
      setIsPartnersOpen(false);
    }, 3000);
  };

  const handleAffiliates = () => {
    setIsAffiliatesOpen(true);
    setTimeout(() => {
      setAffiliatesContent("This is the affiliates content for the AI assistant.");
      setIsAffiliatesOpen(false);
    }, 3000);
  };

  const handleResellers = () => {
    setIsResellersOpen(true);
    setTimeout(() => {
      setResellersContent("This is the resellers content for the AI assistant.");
      setIsResellersOpen(false);
    }, 3000);
  };

  const handleDistributors = () => {
    setIsDistributorsOpen(true);
    setTimeout(() => {
      setDistributorsContent("This is the distributors content for the AI assistant.");
      setIsDistributorsOpen(false);
    }, 3000);
  };

  const handleCareers = () => {
    setIsCareersOpen(true);
    setTimeout(() => {
      setCareersContent("This is the careers content for the AI assistant.");
      setIsCareersOpen(false);
    }, 3000);
  };

  const handleJobs = () => {
    setIsJobsOpen(true);
    setTimeout(() => {
      setJobsContent("This is the jobs content for the AI assistant.");
      setIsJobsOpen(false);
    }, 3000);
  };

  const handleInternships = () => {
    setIsInternshipsOpen(true);
    setTimeout(() => {
      setInternshipsContent("This is the internships content for the AI assistant.");
      setIsInternshipsOpen(false);
    }, 3000);
  };

  const handleVolunteering = () => {
    setIsVolunteeringOpen(true);
    setTimeout(() => {
      setVolunteeringContent("This is the volunteering content for the AI assistant.");
      setIsVolunteeringOpen(false);
    }, 3000);
  };

  const handleSponsorships = () => {
    setIsSponsorshipsOpen(true);
    setTimeout(() => {
      setSponsorshipsContent("This is the sponsorships content for the AI assistant.");
      setIsSponsorshipsOpen(false);
    }, 3000);
  };

  const handleAdvertising = () => {
    setIsAdvertisingOpen(true);
    setTimeout(() => {
      setAdvertisingContent("This is the advertising content for the AI assistant.");
      setIsAdvertisingOpen(false);
    }, 3000);
  };

  const handlePress = () => {
    setIsPressOpen(true);
    setTimeout(() => {
      setPressContent("This is the press content for the AI assistant.");
      setIsPressOpen(false);
    }, 3000);
  };

  const handleMedia = () => {
    setIsMediaOpen(true);
    setTimeout(() => {
      setMediaContent("This is the media content for the AI assistant.");
      setIsMediaOpen(false);
    }, 3000);
  };

  const handleInvestors = () => {
    setIsInvestorsOpen(true);
    setTimeout(() => {
      setInvestorsContent("This is the investors content for the AI assistant.");
      setIsInvestorsOpen(false);
    }, 3000);
  };

  const handleGovernance = () => {
    setIsGovernanceOpen(true);
    setTimeout(() => {
      setGovernanceContent("This is the governance content for the AI assistant.");
      setIsGovernanceOpen(false);
    }, 3000);
  };

  const handleEthics = () => {
    setIsEthicsOpen(true);
    setTimeout(() => {
      setEthicsContent("This is the ethics content for the AI assistant.");
      setIsEthicsOpen(false);
    }, 3000);
  };

  const handleCompliance = () => {
    setIsComplianceOpen(true);
    setTimeout(() => {
      setComplianceContent("This is the compliance content for the AI assistant.");
      setIsComplianceOpen(false);
    }, 3000);
  };

  const handleCertifications = () => {
    setIsCertificationsOpen(true);
    setTimeout(() => {
      setCertificationsContent("This is the certifications content for the AI assistant.");
      setIsCertificationsOpen(false);
    }, 3000);
  };

  const handleAwards = () => {
    setIsAwardsOpen(true);
    setTimeout(() => {
      setAwardsContent("This is the awards content for the AI assistant.");
      setIsAwardsOpen(false);
    }, 3000);
  };

  const handleRecognition = () => {
    setIsRecognitionOpen(true);
    setTimeout(() => {
      setRecognitionContent("This is the recognition content for the AI assistant.");
      setIsRecognitionOpen(false);
    }, 3000);
  };

  const handleTestimonials = () => {
    setIsTestimonialsOpen(true);
    setTimeout(() => {
      setTestimonialsContent("This is the testimonials content for the AI assistant.");
      setIsTestimonialsOpen(false);
    }, 3000);
  };

  const handleReviews = () => {
    setIsReviewsOpen(true);
    setTimeout(() => {
      setReviewsContent("This is the reviews content for the AI assistant.");
      setIsReviewsOpen(false);
    }, 3000);
  };

  const handleCaseStudies = () => {
    setIsCaseStudiesOpen(true);
    setTimeout(() => {
      setCaseStudiesContent("This is the case studies content for the AI assistant.");
      setIsCaseStudiesOpen(false);
    }, 3000);
  };

  const handleWhitePapers = () => {
    setIsWhitePapersOpen(true);
    setTimeout(() => {
      setWhitePapersContent("This is the white papers content for the AI assistant.");
      setIsWhitePapersOpen(false);
    }, 3000);
  };

  const handleReports = () => {
    setIsReportsOpen(true);
    setTimeout(() => {
      setReportsContent("This is the reports content for the AI assistant.");
      setIsReportsOpen(false);
    }, 3000);
  };

  const handleStatistics = () => {
    setIsStatisticsOpen(true);
    setTimeout(() => {
      setStatisticsContent("This is the statistics content for the AI assistant.");
      setIsStatisticsOpen(false);
    }, 30
