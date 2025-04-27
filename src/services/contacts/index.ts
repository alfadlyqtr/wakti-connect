
// Re-export all contact-related functionality from a single entry point
export { getUserContacts, getContactRequests, getStaffContacts } from './contactQueries';
export { sendContactRequest, respondToContactRequest, deleteContact } from './contactMutations';
export { checkContactRequest } from './contactSearch';
export { 
  syncStaffBusinessContacts, 
  ensureStaffContacts, 
  getAutoAddStaffSetting,
  forceSyncStaffContacts
} from './contactSync';
export { 
  fetchAutoApproveSetting, 
  updateAutoApproveContacts, 
  fetchAutoAddStaffSetting, 
  updateAutoAddStaffSetting 
} from './contactSettings';
