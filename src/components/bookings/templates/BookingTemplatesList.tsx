
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Globe, EyeOff, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { BookingTemplateWithRelations } from "@/types/booking.types";
import { formatCurrency } from "@/utils/formatUtils";
import { useMobileBreakpoint } from "@/hooks/useBreakpoint";
import { useTranslation } from "react-i18next";

interface BookingTemplatesListProps {
  templates: BookingTemplateWithRelations[];
  onEdit: (template: BookingTemplateWithRelations) => void;
  onDelete: (templateId: string) => void;
  onPublish: (templateId: string, isPublished: boolean) => void;
  onManageAvailability: (template: BookingTemplateWithRelations) => void;
  isDeleting: boolean;
  isPublishing: boolean;
}

const BookingTemplatesList: React.FC<BookingTemplatesListProps> = ({
  templates,
  onEdit,
  onDelete,
  onPublish,
  onManageAvailability,
  isDeleting,
  isPublishing
}) => {
  const [deleteTemplateId, setDeleteTemplateId] = React.useState<string | null>(null);
  const [publishTemplateId, setPublishTemplateId] = React.useState<string | null>(null);
  const [publishAction, setPublishAction] = React.useState<boolean>(false);
  const isMobile = useMobileBreakpoint(); // This hook returns a boolean
  const { t } = useTranslation();

  const templateToDelete = templates.find(t => t.id === deleteTemplateId);
  const templateToPublish = templates.find(t => t.id === publishTemplateId);

  const handleDeleteClick = (id: string) => {
    setDeleteTemplateId(id);
  };

  const handlePublishClick = (id: string, publish: boolean) => {
    setPublishTemplateId(id);
    setPublishAction(publish);
  };

  const confirmDelete = () => {
    if (deleteTemplateId) {
      onDelete(deleteTemplateId);
    }
  };

  const confirmPublish = () => {
    if (publishTemplateId !== null) {
      onPublish(publishTemplateId, publishAction);
    }
  };

  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">{t('booking.noTemplates')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <Card key={template.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                  <Badge variant={template.is_published ? "success" : "secondary"}>
                    {template.is_published ? t('booking.templateBooking.published') : t('booking.templateBooking.draft')}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description || t('booking.noDescription')}
                </p>
                
                <div className="text-sm space-y-1">
                  <div className="flex gap-2">
                    <span className="font-medium">{t('booking.duration')}:</span> 
                    <span>{template.duration} {t('booking.minutes')}</span>
                  </div>
                  
                  {template.price !== null && (
                    <div className="flex gap-2">
                      <span className="font-medium">{t('booking.price')}:</span> 
                      <span>{formatCurrency(template.price)}</span>
                    </div>
                  )}
                  
                  {template.service && (
                    <div className="flex gap-2">
                      <span className="font-medium">{t('booking.service')}:</span> 
                      <span>{template.service.name}</span>
                    </div>
                  )}
                  
                  {template.staff && (
                    <div className="flex gap-2">
                      <span className="font-medium">{t('booking.staff')}:</span> 
                      <span>{template.staff.name}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`flex ${isMobile ? 'flex-row flex-wrap justify-end gap-2 mt-3' : 'sm:flex-col gap-2'}`}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(template)}
                  className="w-auto sm:w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {t('common.edit')}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onManageAvailability(template)}
                  className="w-auto sm:w-full"
                >
                  <CalendarClock className="h-4 w-4 mr-2" />
                  {t('booking.templateBooking.availability')}
                </Button>
                
                <Button
                  variant={template.is_published ? "outline" : "default"}
                  size="sm"
                  onClick={() => handlePublishClick(template.id, !template.is_published)}
                  disabled={isPublishing}
                  className="w-auto sm:w-full"
                >
                  {template.is_published ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      {t('booking.unpublish')}
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      {t('booking.publish')}
                    </>
                  )}
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(template.id)}
                  disabled={isDeleting}
                  className="w-auto sm:w-full"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {t('common.delete')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        title={t('booking.templateBooking.deleteTemplate')}
        description={`${t('booking.templateBooking.deleteTemplateConfirm')}`}
        open={!!deleteTemplateId}
        onOpenChange={() => setDeleteTemplateId(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
      />

      {/* Publish/Unpublish Confirmation Dialog */}
      <ConfirmationDialog
        title={publishAction ? t('booking.publish') : t('booking.unpublish')}
        description={
          publishAction 
            ? `${t('booking.publishConfirm', { name: templateToPublish?.name })}` 
            : `${t('booking.unpublishConfirm', { name: templateToPublish?.name })}`
        }
        open={!!publishTemplateId}
        onOpenChange={() => setPublishTemplateId(null)}
        onConfirm={confirmPublish}
        isLoading={isPublishing}
        confirmLabel={publishAction ? t('booking.publish') : t('booking.unpublish')}
        cancelLabel={t('common.cancel')}
      />
    </div>
  );
};

export default BookingTemplatesList;
