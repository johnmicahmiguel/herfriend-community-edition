"use client";

import React from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import UserProfileContent from "./UserProfileContent";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    bio?: string;
    specialty?: string;
    online: boolean;
    followers?: number;
    following?: number;
    posts?: {
      id: string;
      image: string;
      caption: string;
      likes: number;
      comments: number;
      timestamp: string;
    }[];
    services?: {
      title: string;
      price: string;
      description: string;
    }[];
    socialMedia?: {
      instagram?: string;
      twitter?: string;
      tiktok?: string;
    };
  };
  onClose: () => void;
  open: boolean;
}

export default function UserProfileModal({ user, onClose, open }: UserProfileProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 dark:bg-black/50 data-[state=open]:animate-overlayShow z-[100]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[calc(100%-2rem)] max-w-md overflow-hidden max-h-[80vh] mt-4 flex flex-col data-[state=open]:animate-contentShow focus:outline-none z-[101]">
          <Dialog.Title className="sr-only">{user.name}</Dialog.Title>
          <Dialog.Close className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-10" aria-label="Close profile">
            <X size={20} />
          </Dialog.Close>
          <Dialog.Description className="sr-only">User profile</Dialog.Description>
          <UserProfileContent user={user} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
