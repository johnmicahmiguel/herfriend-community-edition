"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MessageSearchProps, UserItemProps } from "@/types/messages";
import { searchUsersAction } from "@/app/actions/user.action";
import { useAuth } from "@/lib/context/auth.context";

// Placeholder User Data
const placeholderUsers: UserItemProps["user"][] = [
  {
    uid: "user4",
    name: "Charlie",
    email: "charlie@example.com",
    profilePic: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    // createdAt: new Date(), // createdAt might not be needed for selection
  },
  {
    uid: "user5",
    name: "Diana",
    email: "diana@example.com",
    profilePic: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

// User item component
const UserItem: React.FC<UserItemProps> = ({ user, onSelect }) => {
  return (
    <div
      className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors rounded-md"
      onClick={() => onSelect(user)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(user); }}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={user.profilePic || "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
          alt={user.name || user.email}
          width={40}
          height={40}
          className="object-cover bg-gray-200"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
          {user.name || "Unnamed User"}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
      </div>
    </div>
  );
};

const MessageSearch: React.FC<MessageSearchProps> = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<UserItemProps["user"][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Debounce search
  useEffect(() => {
    if (searchQuery.length < 3) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    const timeout = setTimeout(async () => {
      try {
        const res = await searchUsersAction({
          currentUserUid: user?.uid || "",
          query: searchQuery,
          page: 1,
          limit: 10,
        });
        if (active) {
          setResults(res.users.map((u: any) => ({
            uid: u.uid,
            name: u.username,
            email: u.email,
            profilePic: u.profilePic,
          })));
          setLoading(false);
        }
      } catch (e: any) {
        if (active) {
          setError(e.message || "Failed to search users");
          setLoading(false);
        }
      }
    }, 400);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [searchQuery, user?.uid]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <input
          type="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-blue-100 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          placeholder="Search users by name or email..."
          aria-label="Search users"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="space-y-1 bg-blue-50 dark:bg-gray-900 p-2 rounded-md">
        {searchQuery.length < 3 && placeholderUsers.map((user) => (
          <UserItem
            key={user.uid}
            user={user}
            onSelect={onSelectUser}
          />
        ))}
        {searchQuery.length >= 3 && loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center p-4">Searching...</p>
        )}
        {searchQuery.length >= 3 && error && (
          <p className="text-sm text-red-500 text-center p-4">{error}</p>
        )}
        {searchQuery.length >= 3 && !loading && !error && results.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center p-4">No users found.</p>
        )}
        {searchQuery.length >= 3 && !loading && !error && results.map((user) => (
          <UserItem
            key={user.uid}
            user={user}
            onSelect={onSelectUser}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageSearch;
