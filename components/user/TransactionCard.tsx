"use client";

import React from "react";
import { ArrowUpCircle, ArrowDownCircle, RefreshCcw, Gift, Diamond, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Transaction, TransactionType, TransactionStatus } from "./WalletTypes";
import { format } from "date-fns";

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  // Get the transaction icon based on transaction type
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case "topup":
        return <ArrowUpCircle className="text-green-500" size={16} />;
      case "purchase":
        return <ArrowDownCircle className="text-red-500" size={16} />;
      case "refund":
        return <RefreshCcw className="text-amber-500" size={16} />;
      case "reward":
        return <Gift className="text-purple-500" size={16} />;
      case "gift":
        return <Gift className="text-blue-500" size={16} />;
      default:
        return <Diamond className="text-blue-500" size={16} />;
    }
  };

  // Get the status icon based on transaction status
  const getStatusIcon = () => {
    switch (transaction.status) {
      case "completed":
        return <CheckCircle className="text-green-500" size={16} />;
      case "pending":
        return <Clock className="text-amber-500" size={16} />;
      case "failed":
        return <AlertCircle className="text-red-500" size={16} />;
      case "refunded":
        return <RefreshCcw className="text-purple-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  // Format date
  const formattedDate = format(new Date(transaction.createdAt), "MMM d, yyyy • h:mm a");

  // Determine if the transaction adds or removes diamonds
  const isPositive = ["topup", "refund", "reward", "gift"].includes(transaction.type);
  
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-800">
            {getTransactionIcon()}
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-100">{transaction.description}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className={`flex items-center gap-1 font-medium ${
            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            <Diamond size={14} />
            <span>{isPositive ? '+' : '-'}{transaction.amount}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
            {getStatusIcon()}
            <span>{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
          </div>
        </div>
      </div>
      
      {transaction.paymentMethod && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Payment Method: {transaction.paymentMethod}
          </p>
        </div>
      )}
    </div>
  );
} 