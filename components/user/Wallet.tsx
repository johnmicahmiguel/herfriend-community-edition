"use client";

import React from "react";
import { WalletBalance } from "./WalletTypes";
import WalletContent from "./WalletContent";

interface WalletProps {
  walletBalance?: WalletBalance;
  className?: string;
}

export default function Wallet({ walletBalance, className = "" }: WalletProps) {
  // Default wallet balance if not provided
  const defaultWalletBalance: WalletBalance = {
    diamonds: 1250,
    formattedValue: "1,250"
  };
  
  return (
    <WalletContent 
      walletBalance={walletBalance || defaultWalletBalance} 
      className={className}
    />
  );
} 