
import React from 'react';
import { BusinessPageData } from './types';
import { Card, CardContent } from '@/components/ui/card';

interface SimplePagePreviewProps {
  pageData: BusinessPageData;
}

const SimplePagePreview: React.FC<SimplePagePreviewProps> = ({ pageData }) => {
  const { pageSetup, logo, contactInfo, theme, chatbot } = pageData;

  // Function to get text alignment class
  const getAlignmentClass = (alignment: string) => {
    switch (alignment) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      case 'center': return 'text-center';
      default: return 'text-left';
    }
  };

  // Format website style based on theme
  const websiteStyle = {
    fontFamily: theme.fontStyle === 'serif' ? 'Georgia, serif' : 
               theme.fontStyle === 'monospace' ? 'monospace' : 
               'system-ui, sans-serif',
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
  };

  // Display the page URL based on slug if available
  const pageUrlDisplay = pageData.pageSlug ? 
    `wakti.qa/${pageData.pageSlug}` : 
    'wakti.qa/your-business-page';

  return (
    <div style={websiteStyle} className="min-h-[800px] border rounded-md overflow-hidden">
      {/* URL Display at the top */}
      <div className="bg-gray-100 text-gray-800 text-sm px-4 py-1 flex items-center">
        <span className="inline-block mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </span>
        {pageUrlDisplay}
      </div>

      {/* Header Section */}
      <header className={`py-8 px-4 ${getAlignmentClass(pageSetup.alignment)}`}>
        {logo.visible && logo.url && (
          <div className="flex justify-center mb-4">
            <img 
              src={logo.url} 
              alt={pageSetup.businessName} 
              className={`h-24 w-24 object-contain ${logo.shape === 'circle' ? 'rounded-full' : 'rounded-md'}`}
            />
          </div>
        )}
        <h1 className="text-3xl font-bold">{pageSetup.businessName}</h1>
        {pageSetup.description && (
          <p className="mt-2">{pageSetup.description}</p>
        )}
      </header>

      {/* Contact Information */}
      <section className="py-6 px-4 bg-opacity-10" style={{backgroundColor: `${theme.backgroundColor}ee`}}>
        <h2 className="text-xl font-bold mb-4 text-center">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {contactInfo.email && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium">Email</h3>
                <p>{contactInfo.email}</p>
              </CardContent>
            </Card>
          )}
          
          {contactInfo.phone && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium">Phone</h3>
                <p>{contactInfo.phone}</p>
              </CardContent>
            </Card>
          )}
          
          {contactInfo.whatsapp && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium">WhatsApp</h3>
                <p>{contactInfo.whatsapp}</p>
              </CardContent>
            </Card>
          )}
          
          {(contactInfo.facebook || contactInfo.instagram) && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium">Social Media</h3>
                {contactInfo.facebook && <p className="mb-1">Facebook</p>}
                {contactInfo.instagram && <p>Instagram</p>}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Chatbot Preview */}
      {chatbot.visible && chatbot.embedCode && (
        <div className={`fixed bottom-6 ${chatbot.position === 'left' ? 'left-6' : 'right-6'}`}>
          <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="mt-2 text-xs text-center text-gray-500">TMW Chatbot</div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 px-4 mt-8 text-center" style={{backgroundColor: `${theme.backgroundColor}cc`}}>
        <p className="text-sm opacity-70">© {new Date().getFullYear()} {pageSetup.businessName}</p>
        <p className="text-xs mt-1 opacity-50">Powered by WAKTI</p>
      </footer>
    </div>
  );
};

export default SimplePagePreview;
