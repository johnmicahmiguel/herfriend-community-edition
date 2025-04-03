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
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 z-[9999] rounded-lg bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="text-xl font-bold text-center text-unicef mb-4">
            Welcome to Unicef
          </Dialog.Title>

          <Dialog.Description className="text-center text-gray-600 mb-6">
            Join lobbies, listen to hosts, and connect with others. Sign in to
            unlock all features.
          </Dialog.Description>

          <div className="flex flex-col gap-3">
            <button
              onClick={signInWithGoogle}
              className="px-4 py-2 text-white rounded bg-unicef hover:bg-opacity-90 flex items-center justify-center gap-2"
            >
              Sign in with Google
            </button>

            <button
              onClick={handleContinueAsGuest}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Continue as Guest
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:text-gray-700"
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
