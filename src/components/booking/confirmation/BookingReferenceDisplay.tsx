
import React from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface BookingReferenceDisplayProps {
  bookingId: string;
}

const BookingReferenceDisplay: React.FC<BookingReferenceDisplayProps> = ({ 
  bookingId 
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingId);
    toast({
      title: "Copied to clipboard",
      description: "Booking reference has been copied to your clipboard.",
    });
  };

  // Format the booking ID to be more readable
  const formatBookingId = (id: string) => {
    // Take just the first 8 characters for simplicity
    const shortId = id.substring(0, 8).toUpperCase();
    // Insert a dash for readability
    return `${shortId.substring(0, 4)}-${shortId.substring(4)}`;
  };

  return (
    <div className="bg-primary/5 p-4 rounded-md">
      <p className="text-sm font-medium mb-2">Booking Reference</p>
      <div className="flex items-center justify-between bg-background border rounded-md p-2">
        <code className="text-sm font-mono">{formatBookingId(bookingId)}</code>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyToClipboard}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Copy</span>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Please save this reference for any inquiries about your booking.
      </p>
    </div>
  );
};

export default BookingReferenceDisplay;
