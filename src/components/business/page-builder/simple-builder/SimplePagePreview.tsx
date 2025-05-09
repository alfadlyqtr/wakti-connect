
import React from 'react';
import { BusinessPageData } from './types';

interface SimplePagePreviewProps {
  pageData: BusinessPageData;
}

const SimplePagePreview: React.FC<SimplePagePreviewProps> = ({ pageData }) => {
  return (
    <div className="h-full overflow-auto">
      <div 
        className="min-h-full" 
        style={{ 
          fontFamily: pageData.theme.fontStyle, 
          backgroundColor: pageData.theme.backgroundColor,
          color: pageData.theme.textColor
        }}
      >
        {/* Header */}
        <header className="p-6 flex flex-col items-center border-b">
          {pageData.logo.url && (
            <div className="mb-4">
              <img 
                src={pageData.logo.url} 
                alt={pageData.pageSetup.businessName} 
                className="h-20 w-20 object-contain"
                style={{ borderRadius: pageData.logo.shape === "circle" ? "50%" : "0" }}
              />
            </div>
          )}
          <h1 className="text-2xl font-bold mb-2">{pageData.pageSetup.businessName}</h1>
          {pageData.pageSetup.description && (
            <p className="text-center max-w-md">{pageData.pageSetup.description}</p>
          )}
        </header>

        <main className="p-6 max-w-2xl mx-auto">
          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact</h2>
            <div className="space-y-2">
              {pageData.contactInfo.email && (
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>{pageData.contactInfo.email}</span>
                </div>
              )}
              {pageData.contactInfo.phone && (
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>{pageData.contactInfo.phone}</span>
                </div>
              )}
              {pageData.contactInfo.whatsapp && (
                <div className="flex items-center gap-2">
                  <span>💬</span>
                  <span>WhatsApp: {pageData.contactInfo.whatsapp}</span>
                </div>
              )}
            </div>
          </section>

          {/* Social Links */}
          {(pageData.contactInfo.facebook || pageData.contactInfo.instagram) && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
              <div className="flex gap-4">
                {pageData.contactInfo.facebook && (
                  <a 
                    href={pageData.contactInfo.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Facebook
                  </a>
                )}
                {pageData.contactInfo.instagram && (
                  <a 
                    href={pageData.contactInfo.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-pink-600 text-white rounded"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Business Hours */}
          {pageData.workingHours.visible && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
              <div className="space-y-2">
                {pageData.workingHours.hours.map((hour, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{hour.day}</span>
                    <span>{hour.isOpen ? hour.hours : "Closed"}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Location */}
          {pageData.contactInfo.googleMaps && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <a 
                href={pageData.contactInfo.googleMaps} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded"
              >
                View on Google Maps
              </a>
            </section>
          )}

          {/* Booking */}
          {pageData.bookings.visible && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Bookings</h2>
              <p>Bookings are available for this business. Contact us to schedule an appointment.</p>
            </section>
          )}

          {/* Chatbot Preview Placeholder */}
          {pageData.chatbot.visible && (
            <div 
              className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border"
              style={{ display: pageData.chatbot.position === 'right' ? 'block' : 'none' }}
            >
              <p className="font-semibold">Chatbot</p>
              <p className="text-sm text-gray-500">The chatbot will appear here on the published page.</p>
            </div>
          )}
        </main>

        <footer className="p-6 border-t text-center">
          <p className="text-sm opacity-75">© {new Date().getFullYear()} {pageData.pageSetup.businessName}</p>
        </footer>
      </div>
    </div>
  );
};

export default SimplePagePreview;
