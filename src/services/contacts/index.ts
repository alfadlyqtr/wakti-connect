
// Re-export all contact-related functionality from a single entry point
export { getUserContacts, getContactRequests } from './contactQueries';
export { sendContactRequest, respondToContactRequest, deleteContact } from './contactMutations';
export { searchUsers, checkContactRequest } from './contactSearch';
export { syncStaffBusinessContacts, ensureStaffContacts } from './contactSync';
export { fetchAutoApproveSetting, updateAutoApproveContacts } from './contactSettings';
