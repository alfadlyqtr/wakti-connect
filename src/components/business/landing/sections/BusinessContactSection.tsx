
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";
import { generateTomTomMapsUrl, TOMTOM_API_KEY } from "@/config/maps";

export interface BusinessContactSectionProps {
  businessName: string;
  businessAddress: string;
  businessPhoneNumber: string;
  businessEmail: string;
}

const BusinessContactSection: React.FC<BusinessContactSectionProps> = ({
  businessName,
  businessAddress,
  businessPhoneNumber,
  businessEmail,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (businessAddress) {
      setMapUrl(generateTomTomMapsUrl(businessAddress));
    }
  }, [businessAddress]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !email || !message) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Message sent successfully!",
      });

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="lg:flex">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Contact Us
            </h2>
            <p className="text-gray-600 mb-8">
              We're here to help! Please fill out the form below to get in
              touch with us.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-6">
                <Label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <Button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Our Location
            </h2>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-semibold text-gray-700">Address:</span>
              </div>
              <p className="text-gray-600">{businessAddress}</p>
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View on Map
                </a>
              )}
            </div>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Phone className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-semibold text-gray-700">Phone:</span>
              </div>
              <p className="text-gray-600">{businessPhoneNumber}</p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <Mail className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-semibold text-gray-700">Email:</span>
              </div>
              <p className="text-gray-600">{businessEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessContactSection;
