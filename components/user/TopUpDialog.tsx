"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Diamond, CreditCard, Sparkles, Check } from "lucide-react";
import { TopUpOption } from "./WalletTypes";

// Sample top-up options
const TOP_UP_OPTIONS: TopUpOption[] = [
  { id: "option1", amount: 4.99, diamonds: 100, discountPercentage: 0 },
  { id: "option2", amount: 9.99, diamonds: 250, discountPercentage: 5 },
  { id: "option3", amount: 19.99, diamonds: 550, discountPercentage: 10, isMostPopular: true },
  { id: "option4", amount: 49.99, diamonds: 1500, discountPercentage: 15 },
  { id: "option5", amount: 99.99, diamonds: 3500, discountPercentage: 20 },
];

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchase: (option: TopUpOption) => void;
}

export default function TopUpDialog({ open, onOpenChange, onPurchase }: TopUpDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const handlePurchase = () => {
    if (!selectedOption) return;
    
    const option = TOP_UP_OPTIONS.find(opt => opt.id === selectedOption);
    if (option) {
      onPurchase(option);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[60]" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-800 rounded-lg shadow-lg z-[70] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Diamond className="text-blue-500" size={20} />
              <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Get More Diamonds
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          
          <div className="p-4 overflow-y-auto">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Diamonds are used across the app for premium features, special interactions, and unlocking exclusive content.
            </p>
            
            <div className="space-y-3 mb-6">
              {TOP_UP_OPTIONS.map((option) => (
                <div 
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all relative ${
                    selectedOption === option.id
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  {option.isMostPopular && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedOption === option.id ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <Diamond className="text-blue-500" size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-100">
                          {option.diamonds} Diamonds
                        </h3>
                        {option.discountPercentage && option.discountPercentage > 0 && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {option.discountPercentage}% Bonus
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800 dark:text-gray-100">
                        ${option.amount.toFixed(2)}
                      </div>
                      {selectedOption === option.id && (
                        <div className="text-blue-500">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="text-gray-600 dark:text-gray-300" size={18} />
                <h3 className="font-medium text-gray-800 dark:text-gray-100">Payment Methods</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We accept credit cards, PayPal, and Apple Pay. All transactions are secure and encrypted.
              </p>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={handlePurchase}
              disabled={!selectedOption}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                selectedOption
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sparkles size={16} />
              Purchase Diamonds
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
