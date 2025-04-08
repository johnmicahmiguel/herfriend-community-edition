"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Bookmark, UserPlus } from "lucide-react";
import { FaInstagram, FaTwitter } from 'react-icons/fa';
import * as Tabs from "@radix-ui/react-tabs";

interface UserProfileContentProps {
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
  className?: string;
}

export default function UserProfileContent({ user, className = "" }: UserProfileContentProps) {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full overflow-hidden max-h-[80vh] flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-20 h-20 rounded-full overflow-hidden border-2 ${user.online ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
              <Image
                src={user.avatar}
                alt={user.name}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            {user.online && (
              <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
                <span className="block w-2 h-2 rounded-full" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold dark:text-gray-100">{user.name}</h2>
            {user.specialty && <p className="text-sm text-gray-500 dark:text-gray-400">{user.specialty}</p>}

            <div className="flex gap-4 mt-2 text-sm dark:text-gray-300">
              <div>
                <span className="font-semibold">{user.followers || 0}</span> followers
              </div>
              <div>
                <span className="font-semibold">{user.following || 0}</span> following
              </div>
            </div>

            {user.bio && (
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="bg-blue-500 text-white px-3 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-1">
            <UserPlus size={16} />
            Follow
          </button>
          <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-full text-sm font-medium">
            Book Session
          </button>
          <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-full text-sm font-medium">
            Send Gift
          </button>
        </div>

        {user.socialMedia && (
          <div className="flex gap-3 mt-4 justify-center">
            {user.socialMedia.instagram && (
              <a href={user.socialMedia.instagram} className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-500" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={20} className="text-blue-500 cursor-pointer" />
              </a>
            )}
            {user.socialMedia.twitter && (
              <a href={user.socialMedia.twitter} className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400" target="_blank" rel="noopener noreferrer">
                <FaTwitter size={20} className="text-blue-500 cursor-pointer" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs.Root
        defaultValue="posts"
        className="flex-1 flex flex-col overflow-hidden"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700">
          <Tabs.Trigger
            value="posts"
            className={`flex-1 py-3 text-sm font-medium ${activeTab === "posts" ? "text-blue-500 border-b-2 border-blue-500 relative -mb-[2px]" : "text-gray-600 dark:text-gray-300"}`}
          >
            Posts
          </Tabs.Trigger>
          <Tabs.Trigger
            value="services"
            className={`flex-1 py-3 text-sm font-medium ${activeTab === "services" ? "text-blue-500 border-b-2 border-blue-500 relative -mb-[2px]" : "text-gray-600 dark:text-gray-300"}`}
          >
            Services
          </Tabs.Trigger>
          <Tabs.Trigger
            value="about"
            className={`flex-1 py-3 text-sm font-medium ${activeTab === "about" ? "text-blue-500 border-b-2 border-blue-500 relative -mb-[2px]" : "text-gray-600 dark:text-gray-300"}`}
          >
            More
          </Tabs.Trigger>
        </Tabs.List>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-800">
          <Tabs.Content value="posts" className="space-y-6 outline-none">
            {user.posts && user.posts.length > 0 ? (
              user.posts.map(post => (
                <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="relative h-64 w-full">
                    <Image
                      src={post.image}
                      alt={post.caption}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 dark:bg-gray-750">
                    <p className="text-sm dark:text-gray-200">{post.caption}</p>
                    <div className="flex justify-between mt-3 text-gray-500 dark:text-gray-400 text-sm">
                      <div className="flex gap-4">
                        <button className="flex items-center gap-1">
                          <Heart size={16} /> {post.likes}
                        </button>
                        <button className="flex items-center gap-1">
                          <MessageCircle size={16} /> {post.comments}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button><Share2 size={16} /></button>
                        <button><Bookmark size={16} /></button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{post.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No posts yet
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="services" className="space-y-4 outline-none">
            {user.services && user.services.length > 0 ? (
              user.services.map((service, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-750">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium dark:text-gray-200">{service.title}</h3>
                    <span className="text-blue-500 dark:text-blue-400 font-semibold">{service.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{service.description}</p>
                  <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium">
                    Book Now
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No services available
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="about" className="space-y-4 outline-none">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
              <h3 className="font-medium mb-2 dark:text-gray-200">Bio</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{user.bio || 'No bio available'}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
              <h3 className="font-medium mb-2 dark:text-gray-200">Specialty</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{user.specialty || 'Not specified'}</p>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
