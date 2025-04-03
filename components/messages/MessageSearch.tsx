"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { MessageSearchProps, UserItemProps } from "@/types/messages";
import { debounce } from "lodash";

// Define the search result type
interface SearchResult {
  users: Array<{
    uid: string;
    name: string | null;
    email: string;
    profilePic: string | null;
    createdAt: Date;
  }>;
  total: number;
  hasMore: boolean;
}

// User item component
const UserItem: React.FC<UserItemProps> = ({ user, onSelect }) => {
  return (
    <div
      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onSelect(user)}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <Image
          src={
            user.profilePic ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80&sat=-100"
          }
          alt={user.name || user.email}
          width={48}
          height={48}
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">
          {user.name || "User"}
        </h3>
        <p className="text-sm text-gray-500 truncate">{user.email}</p>
      </div>
    </div>
  );
};

const MessageSearch: React.FC<MessageSearchProps> = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default MessageSearch;
