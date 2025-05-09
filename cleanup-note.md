
# Cleanup Note

The following files can be safely deleted as we've replaced the subscriber system with the contacts system:

1. src/hooks/useBusinessSubscribers.ts
2. src/components/business/subscribers/SubscribersList.tsx
3. src/pages/dashboard/DashboardSubscribers.tsx
4. src/components/business/landing/BusinessSubscribeButton.tsx
5. src/components/business/landing/SubscribeButtonContent.tsx
6. src/components/business/landing/FloatingSubscribeButton.tsx
7. src/components/business/landing/BusinessContactsList.tsx (replaced with BusinessContactsList.tsx)
8. src/hooks/useUserSubscriptions.ts (functionality merged into useContacts)

Note that we don't need to remove the database tables since they may still contain data that admins might want to access. But they are no longer actively used by the application.
