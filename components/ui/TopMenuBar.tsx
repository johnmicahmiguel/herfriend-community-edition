"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown, Sun, Moon } from "lucide-react";
import { useAuth } from "@/lib/context/auth.context";
import { LoginModal } from "@/components/auth/LoginModal";
import { useSidebar } from "@/lib/context/sidebar.context";
import { useTheme } from "next-themes";

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={username} width={32} height={32} />
          ) : (
            <User size={20} className="text-gray-700 dark:text-gray-300" />
          )}
        </div>
        <span className="hidden md:inline text-gray-700 dark:text-gray-200">{username}</span>
        <ChevronDown size={16} className="text-gray-700 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 dark:bg-gray-800">
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} className="mr-2" />
            Your Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} className="mr-2" />
            Settings
          </Link>
          <button
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={async () => {
              setIsOpen(false);
              await onSignOut();
            }}
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
  const { setIsMobileSidebarOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const logoSrc = mounted && theme === 'dark' ? "/images/logo-horizontal-white.png" : "/images/logo-horizontal.png";

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
          className="px-4 py-2 text-white rounded bg-blue-500 hover:bg-opacity-90 dark:bg-blue-600 dark:hover:bg-blue-700"
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
    <header className="bg-white shadow-sm w-full z-[60] relative dark:bg-gray-900 dark:border-b dark:border-gray-700">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 rounded-md bg-white border border-gray-300 shadow mr-2 dark:bg-gray-800 dark:border-gray-600"
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo - positioned at extreme left */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src={logoSrc}
                alt="Logo"
                width={1024}
                height={1024}
                className="h-34 w-auto"
                priority
              />
              {/* <span className="ml-3 text-lg font-semibold text-gray-700">
                Social Lobby App
              </span> */}
            </Link>
          </div>

          {/* Empty space to push elements to extremes */}
          <div className="flex-grow"></div>

          {/* Right side controls: Theme Toggle + Auth */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}

            {/* Auth section - positioned at extreme right */}
            {renderAuthSection()}
          </div>
        </div>
      </div>

      {/* Login Modal - controlled by the parent component */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </header>
  );
};

export default TopMenuBar;
