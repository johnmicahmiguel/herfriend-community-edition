"use client";

import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Diamond, Plus, History, FileText, ChevronDown, ChevronUp, Filter, Download } from "lucide-react";
import { WalletBalance, Transaction, Invoice, TopUpOption } from "./WalletTypes";
import TransactionCard from "./TransactionCard";
import InvoiceCard from "./InvoiceCard";
import TopUpDialog from "./TopUpDialog";

// Mock data
const MOCK_TRANSACTIONS: Transaction[] = [
  { 
    id: "t1", 
    type: "topup", 
    amount: 550, 
    status: "completed", 
    description: "Diamond Purchase", 
    createdAt: "2023-12-01T12:45:00Z",
    paymentMethod: "Credit Card", 
    relatedInvoiceId: "inv1"
  },
  { 
    id: "t2", 
    type: "purchase", 
    amount: 50, 
    status: "completed", 
    description: "Premium Content Access", 
    createdAt: "2023-11-28T16:30:00Z" 
  },
  { 
    id: "t3", 
    type: "reward", 
    amount: 25, 
    status: "completed", 
    description: "Daily Login Bonus", 
    createdAt: "2023-11-25T09:15:00Z" 
  },
  { 
    id: "t4", 
    type: "gift", 
    amount: 100, 
    status: "completed", 
    description: "Admin Gift - Welcome Pack", 
    createdAt: "2023-11-20T14:00:00Z" 
  },
  { 
    id: "t5", 
    type: "topup", 
    amount:
    250, 
    status: "pending", 
    description: "Diamond Purchase", 
    createdAt: "2023-11-18T17:22:00Z",
    paymentMethod: "PayPal", 
    relatedInvoiceId: "inv2"
  },
  { 
    id: "t6", 
    type: "purchase", 
    amount: 150, 
    status: "failed", 
    description: "VIP Room Access", 
    createdAt: "2023-11-15T20:10:00Z" 
  },
];

const MOCK_INVOICES: Invoice[] = [
  { 
    id: "inv1", 
    amount: 19.99, 
    transactionId: "t1", 
    paymentMethod: "Credit Card",
    status: "paid", 
    createdAt: "2023-12-01T12:45:00Z",
    pdfUrl: "/invoices/inv1.pdf" 
  },
  { 
    id: "inv2", 
    amount: 9.99, 
    transactionId: "t5", 
    paymentMethod: "PayPal",
    status: "unpaid", 
    createdAt: "2023-11-18T17:22:00Z" 
  },
  { 
    id: "inv3", 
    amount: 4.99, 
    transactionId: "t7", 
    paymentMethod: "Credit Card",
    status: "cancelled", 
    createdAt: "2023-10-05T11:30:00Z" 
  },
];

interface WalletContentProps {
  walletBalance: WalletBalance;
  className?: string;
}

export default function WalletContent({
  walletBalance,
  className = "",
}: WalletContentProps) {
  const [activeTab, setActiveTab] = useState<"transactions" | "invoices">("transactions");
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [showFilters, setShowFilters] = useState(false);
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string | null>(null);
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string | null>(null);
  
  // Handle diamond purchase
  const handleDiamondPurchase = (option: TopUpOption) => {
    // In a real app, you would call an API to process the purchase
    console.log("Purchasing diamonds:", option);
    
    // Mock adding the transaction and invoice
    const now = new Date().toISOString();
    const newTransactionId = `t${transactions.length + 1}`;
    const newInvoiceId = `inv${invoices.length + 1}`;
    
    const newTransaction: Transaction = {
      id: newTransactionId,
      type: "topup",
      amount: option.diamonds,
      status: "pending",
      description: "Diamond Purchase",
      createdAt: now,
      paymentMethod: "Credit Card",
      relatedInvoiceId: newInvoiceId
    };
    
    const newInvoice: Invoice = {
      id: newInvoiceId,
      amount: option.amount,
      transactionId: newTransactionId,
      paymentMethod: "Credit Card",
      status: "unpaid",
      createdAt: now
    };
    
    setTransactions([newTransaction, ...transactions]);
    setInvoices([newInvoice, ...invoices]);
  };
  
  // Handle invoice download
  const handleInvoiceDownload = (invoiceId: string) => {
    // In a real app, you would initiate a download from your API
    console.log("Downloading invoice:", invoiceId);
    alert(`Downloading invoice ${invoiceId}`);
  };
  
  // Filter transactions by type
  const filteredTransactions = transactionTypeFilter 
    ? transactions.filter(t => t.type === transactionTypeFilter)
    : transactions;
    
  // Filter invoices by status
  const filteredInvoices = invoiceStatusFilter
    ? invoices.filter(i => i.status === invoiceStatusFilter)
    : invoices;
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full overflow-hidden max-h-[90vh] flex flex-col ${className}`}>
      {/* Header - Wallet Balance */}
      <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <Diamond size={24} />
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-bold dark:text-gray-100">My Wallet</h2>
              <div className="flex items-center mt-1">
                <Diamond className="text-blue-500 mr-1" size={18} />
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {walletBalance.formattedValue}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setTopUpDialogOpen(true)}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
          >
            <Plus size={18} />
            <span className="font-medium">Top Up</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs.Root
        defaultValue="transactions"
        className="flex-1 flex flex-col overflow-hidden"
        onValueChange={(value) => setActiveTab(value as "transactions" | "invoices")}
        value={activeTab}
      >
        <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700">
          <Tabs.Trigger
            value="transactions"
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === "transactions" 
                ? "text-blue-500 border-b-2 border-blue-500 relative -mb-[2px]" 
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <History size={16} />
            Transactions
          </Tabs.Trigger>
          <Tabs.Trigger
            value="invoices"
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === "invoices" 
                ? "text-blue-500 border-b-2 border-blue-500 relative -mb-[2px]" 
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <FileText size={16} />
            Invoices
          </Tabs.Trigger>
        </Tabs.List>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-800">
          {/* Filters bar */}
          <div className="mb-4 flex justify-between items-center">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Filter size={16} />
              Filters
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {activeTab === "transactions" ? 
                `${filteredTransactions.length} transactions` : 
                `${filteredInvoices.length} invoices`}
            </div>
          </div>
          
          {/* Filter options */}
          {showFilters && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {activeTab === "transactions" ? (
                <div className="flex flex-wrap gap-2">
                  {["all", "topup", "purchase", "reward", "gift", "refund"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTransactionTypeFilter(type === "all" ? null : type)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        (type === "all" && transactionTypeFilter === null) || type === transactionTypeFilter
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {["all", "paid", "unpaid", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setInvoiceStatusFilter(status === "all" ? null : status)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        (status === "all" && invoiceStatusFilter === null) || status === invoiceStatusFilter
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Transactions tab */}
          <Tabs.Content value="transactions" className="space-y-4 outline-none">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
              </div>
            )}
          </Tabs.Content>

          {/* Invoices tab */}
          <Tabs.Content value="invoices" className="space-y-4 outline-none">
            {filteredInvoices.length > 0 ? (
              <>
                <div className="flex justify-end mb-2">
                  <button className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                    <Download size={16} />
                    Export All
                  </button>
                </div>
                
                {filteredInvoices.map(invoice => (
                  <InvoiceCard 
                    key={invoice.id} 
                    invoice={invoice} 
                    onDownload={handleInvoiceDownload} 
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No invoices found.</p>
              </div>
            )}
          </Tabs.Content>
        </div>
      </Tabs.Root>
      
      {/* Top-up Dialog */}
      <TopUpDialog 
        open={topUpDialogOpen} 
        onOpenChange={setTopUpDialogOpen} 
        onPurchase={handleDiamondPurchase}
      />
    </div>
  );
} 