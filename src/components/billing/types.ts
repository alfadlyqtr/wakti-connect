
export interface BillingInfoType {
  plan: "free" | "individual" | "business";
  status: "active" | "canceled" | "past_due";
  currentPeriodEnd: string;
  amount: number;
  interval: "month" | "year";
}

export interface InvoiceType {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  downloadUrl: string;
}
