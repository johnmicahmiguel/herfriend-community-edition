"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/context/auth.context";
import { LoginModal } from "@/components/auth/LoginModal";

type ProfileDropdownProps = {
  username: string;
  avatarUrl: string;
  onSignOut: () => Promise<void>;
};

const ProfileDropdown = ({
  username,
  avatarUrl,
  onSignOut,
}: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={username} width={32} height={32} />
          ) : (
            <User size={20} className="text-gray-700" />
          )}
        </div>
        <span className="hidden md:inline text-gray-700">{username}</span>
        <ChevronDown size={16} className="text-gray-700" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User size={16} className="mr-2" />
            Your Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings size={16} className="mr-2" />
            Settings
          </Link>
          <button
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={onSignOut}
          >
            <LogOut size={16} className="mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

const TopMenuBar = () => {
  const { user, isAnonymous, signInWithGoogle, signOut, loading } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Determine what to show based on auth state
  const renderAuthSection = () => {
    // Don't render anything while loading
    if (loading) {
      return <div className="w-20 h-10"></div>; // Placeholder with same size as button
    }

    if (!user || isAnonymous) {
      return (
        <button
          onClick={() => setLoginModalOpen(true)}
          className="px-4 py-2 text-white rounded bg-unicef hover:bg-opacity-90"
        >
          Sign In
        </button>
      );
    } else {
      // For authenticated users, show the profile dropdown
      return (
        <ProfileDropdown
          username={user.displayName || user.email || "User"}
          avatarUrl={user.photoURL || ""}
          onSignOut={signOut}
        />
      );
    }
  };

  return (
    <header className="bg-white shadow-sm w-full z-50 relative">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo - positioned at extreme left */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-horizontal.png"
                alt="Logo"
                width={1024}
                height={1024}
                className="h-34 w-auto"
              />
              {/* <span className="ml-3 text-lg font-semibold text-gray-700">
                Social Lobby App
              </span> */}
            </Link>
          </div>

          {/* Empty space to push elements to extremes */}
          <div className="flex-grow"></div>

          {/* Auth section - positioned at extreme right */}
          {renderAuthSection()}
        </div>
      </div>

      {/* Login Modal - controlled by the parent component */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </header>
  );
};

export default TopMenuBar;
