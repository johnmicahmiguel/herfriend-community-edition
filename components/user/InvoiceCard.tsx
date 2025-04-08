"use client";

import React from "react";
import { FileText, Download, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Invoice } from "./WalletTypes";
import { format } from "date-fns";

interface InvoiceCardProps {
  invoice: Invoice;
  onDownload: (invoiceId: string) => void;
}

export default function InvoiceCard({ invoice, onDownload }: InvoiceCardProps) {
  // Format date
  const formattedDate = format(new Date(invoice.createdAt), "MMM d, yyyy");
  
  // Get the status icon based on invoice status
  const getStatusIcon = () => {
    switch (invoice.status) {
      case "paid":
        return <CheckCircle className="text-green-500" size={16} />;
      case "unpaid":
        return <Clock className="text-amber-500" size={16} />;
      case "cancelled":
        return <AlertCircle className="text-red-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-800">
            <FileText className="text-blue-500" size={16} />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-100">Invoice #{invoice.id.slice(-8)}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="font-medium text-gray-800 dark:text-gray-100">
            ${invoice.amount.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
            {getStatusIcon()}
            <span>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Payment Method: {invoice.paymentMethod}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Transaction ID: {invoice.transactionId.slice(-8)}
          </p>
        </div>
        
        {invoice.pdfUrl && invoice.status === "paid" && (
          <button 
            onClick={() => onDownload(invoice.id)}
            className="flex items-center gap-1 px-2 py-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors text-xs"
            title="Download Invoice"
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        )}
      </div>
    </div>
  );
} 