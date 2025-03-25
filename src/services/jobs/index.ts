
// Re-export jobs API functions
export * from './jobsApi';

// Re-export job cards API functions
// Fix: explicitly re-export ensurePaymentMethodType to avoid ambiguity
export { 
  fetchJobCards, 
  createJobCard, 
  completeJobCard,
  // Only export ensurePaymentMethodType once:
  ensurePaymentMethodType 
} from './jobCardsApi';
