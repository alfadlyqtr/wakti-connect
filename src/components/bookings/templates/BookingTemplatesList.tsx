import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Globe, EyeOff, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { BookingTemplateWithRelations } from "@/types/booking.types";
import { formatCurrency } from "@/utils/formatUtils";
import { useMobileBreakpoint } from "@/hooks/useBreakpoint";

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
  const { isMobile } = useMobileBreakpoint();

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
          <p className="text-muted-foreground">No booking templates found.</p>
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
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                  <Badge variant={template.is_published ? "success" : "secondary"}>
                    {template.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description || "No description"}
                </p>
                
                <div className="text-sm space-y-1">
                  <div className="flex gap-2">
                    <span className="font-medium">Duration:</span> 
                    <span>{template.duration} minutes</span>
                  </div>
                  
                  {template.price !== null && (
                    <div className="flex gap-2">
                      <span className="font-medium">Price:</span> 
                      <span>{formatCurrency(template.price)}</span>
                    </div>
                  )}
                  
                  {template.service && (
                    <div className="flex gap-2">
                      <span className="font-medium">Service:</span> 
                      <span>{template.service.name}</span>
                    </div>
                  )}
                  
                  {template.staff && (
                    <div className="flex gap-2">
                      <span className="font-medium">Staff:</span> 
                      <span>{template.staff.name}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`flex ${isMobile ? 'flex-row justify-end' : 'flex-col'} gap-2`}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(template)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onManageAvailability(template)}
                >
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Availability
                </Button>
                
                <Button
                  variant={template.is_published ? "outline" : "default"}
                  size="sm"
                  onClick={() => handlePublishClick(template.id, !template.is_published)}
                  disabled={isPublishing}
                >
                  {template.is_published ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Publish
                    </>
                  )}
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(template.id)}
                  disabled={isDeleting}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        title="Delete Booking Template"
        description={`Are you sure you want to delete "${templateToDelete?.name}"? This action cannot be undone.`}
        open={!!deleteTemplateId}
        onOpenChange={() => setDeleteTemplateId(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      {/* Publish/Unpublish Confirmation Dialog */}
      <ConfirmationDialog
        title={publishAction ? "Publish Booking Template" : "Unpublish Booking Template"}
        description={
          publishAction 
            ? `Are you sure you want to publish "${templateToPublish?.name}"? This will make it visible to customers.` 
            : `Are you sure you want to unpublish "${templateToPublish?.name}"? This will hide it from customers.`
        }
        open={!!publishTemplateId}
        onOpenChange={() => setPublishTemplateId(null)}
        onConfirm={confirmPublish}
        isLoading={isPublishing}
        confirmLabel={publishAction ? "Publish" : "Unpublish"}
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default BookingTemplatesList;
