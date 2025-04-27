
import React from 'react';
import { Card } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { WAKTIAIAssistant } from '@/components/ai/WAKTIAIAssistant';

const BusinessAIAssistantPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>AI Assistant | WAKTI</title>
      </Helmet>
      
      <div className="container p-4 mx-auto">
        <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
        
        <Card className="p-0 overflow-hidden mb-6 border-0 shadow-xl">
          <WAKTIAIAssistant isFullscreen={true} />
        </Card>
      </div>
    </>
  );
};

export default BusinessAIAssistantPage;
