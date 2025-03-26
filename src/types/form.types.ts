
export type EventFormTab = "details" | "customize" | "share";
export type ShareTab = "recipients" | "links";

// Add a constant for using ShareTab as a value in component props
export const SHARE_TABS = {
  RECIPIENTS: "recipients" as ShareTab,
  LINKS: "links" as ShareTab
};
