export interface WalletBalance {
  diamonds: number;
  formattedValue: string; // For display purposes (e.g., "1,000")
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  createdAt: string; // ISO date string
  relatedInvoiceId?: string;
  paymentMethod?: string;
}

export type TransactionType = 
  | "topup" 
  | "purchase" 
  | "refund" 
  | "reward" 
  | "gift";

export type TransactionStatus =
  | "completed"
  | "pending"
  | "failed"
  | "refunded";

export interface Invoice {
  id: string;
  amount: number;
  transactionId: string;
  paymentMethod: string;
  status: "paid" | "unpaid" | "cancelled";
  createdAt: string; // ISO date string
  pdfUrl?: string;
}

export interface TopUpOption {
  id: string;
  amount: number;
  diamonds: number;
  discountPercentage?: number;
  isMostPopular?: boolean;
} 