
import { Event, EventCustomization } from "./event.types";
import { InvitationRecipient } from "./invitation.types";

export type EventFormTab = "details" | "customize" | "share";

export type ShareTab = "recipients" | "qrcode" | "link";

export const SHARE_TABS = {
  RECIPIENTS: "recipients" as const,
  QRCODE: "qrcode" as const,
  LINK: "link" as const
};

export interface FormHeaderProps {
  isEdit: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
}

export interface FormTabsProps {
  activeTab: EventFormTab;
  setActiveTab: (tab: EventFormTab) => void;
}

export interface FormActionsProps {
  onPrev: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  showSubmit?: boolean;
  submitLabel?: string;
}

export interface EventCreationFormProps {
  editEvent?: Event | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

// New simplified event customization options
export interface SimpleEventCustomization {
  background: string;
  textColor: string;
  buttonColor: string;
  headerStyle: 'simple' | 'banner' | 'minimal';
  headerImage?: string;
  enableQRCode?: boolean;
  enableWhatsAppShare?: boolean;
  enableSocialShare?: boolean;
}
