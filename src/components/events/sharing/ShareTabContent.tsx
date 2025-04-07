
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShareTab, SHARE_TABS } from "@/types/form.types";
import { InvitationRecipient } from "@/types/invitation.types";
import RecipientSelector from "@/components/invitations/RecipientSelector";
import ShareLinksTab from "../creation/ShareLinksTab";
import { Mail, QrCode, Link as LinkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ShareTabContentProps {
  recipients?: InvitationRecipient[];
  addRecipient?: (recipient: InvitationRecipient) => void;
  removeRecipient?: (index: number) => void;
  shareTab?: ShareTab;
  setShareTab?: (tab: ShareTab) => void;
  onSendEmail?: (email: string) => void;
}

const ShareTabContent: React.FC<ShareTabContentProps> = ({
  recipients = [],
  addRecipient,
  removeRecipient,
  shareTab = SHARE_TABS.RECIPIENTS,
  setShareTab,
  onSendEmail
}) => {
  const { t } = useTranslation();
  
  const handleTabChange = (value: string) => {
    if (setShareTab) {
      setShareTab(value as ShareTab);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Tabs value={shareTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value={SHARE_TABS.RECIPIENTS} className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">{t('event.invitedParticipants')}</span>
          </TabsTrigger>
          <TabsTrigger value={SHARE_TABS.QRCODE} className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">QR Code</span>
          </TabsTrigger>
          <TabsTrigger value={SHARE_TABS.LINK} className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.viewDetails')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={SHARE_TABS.RECIPIENTS}>
          <div className="mt-4">
            <RecipientSelector
              selectedRecipients={recipients}
              onAddRecipient={recipient => addRecipient?.(recipient)}
              onRemoveRecipient={index => removeRecipient?.(index)}
            />
          </div>
        </TabsContent>

        <TabsContent value={SHARE_TABS.QRCODE}>
          <div className="mt-4 p-6 flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-md shadow-md">
              {/* Placeholder for QR code - would be generated dynamically in production */}
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                <QrCode className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              {t('booking.confirmed')}
            </p>
          </div>
        </TabsContent>

        <TabsContent value={SHARE_TABS.LINK}>
          <ShareLinksTab onSendEmail={onSendEmail} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShareTabContent;
