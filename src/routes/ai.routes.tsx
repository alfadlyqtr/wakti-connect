
import React from 'react';
import { Route } from 'react-router-dom';
import AIAssistantPage from '@/pages/ai/AIAssistantPage';
import AIAccessGuard from '@/components/ai/AIAccessGuard';

/**
 * AI Feature Routes - Protected with AIAccessGuard
 */
export const aiRoutes = (
  <Route path="ai">
    <Route
      path="assistant"
      element={
        <AIAccessGuard>
          <AIAssistantPage />
        </AIAccessGuard>
      }
    />
  </Route>
);
