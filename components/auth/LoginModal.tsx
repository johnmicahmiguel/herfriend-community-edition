"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/auth.context";
import { X } from "lucide-react";
import { LoginModalProps } from "@/types/auth";

export function LoginModal({
  open: externalOpen,
  onOpenChange,
}: LoginModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { user, isAnonymous, signInWithGoogle } = useAuth();

  // Determine if the modal should be open based on props or internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

  // Handle open state changes
  const handleOpenChange = (newOpen: boolean) => {
    if (externalOpen === undefined) {
      // If not controlled externally, update internal state
      setInternalOpen(newOpen);
    }
    // Notify parent component if callback is provided
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  // Handle "Continue as Guest" - just dismiss the modal
  const handleContinueAsGuest = () => {
    handleOpenChange(false);
  };

  useEffect(() => {
    // If user is authenticated and not anonymous, close the modal
    if (user && !isAnonymous) {
      handleOpenChange(false);
    }
  }, [user, isAnonymous]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9999] bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 z-[9999] rounded-lg bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow dark:bg-gray-800">
          <Dialog.Title className="text-xl font-bold text-center text-blue-500 mb-4 dark:text-blue-300">
            Social Lobby Platform
          </Dialog.Title>

          <Dialog.Description className="text-center text-gray-600 mb-6 dark:text-gray-400">
            Join lobbies, listen to hosts, and connect with others. Sign in to
            unlock all features.
          </Dialog.Description>

          <div className="flex flex-col gap-3">
            <button
              onClick={signInWithGoogle}
              className="flex items-center justify-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100
                        dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>


            <button
              onClick={handleContinueAsGuest}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Continue as Guest
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
