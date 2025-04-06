"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Heart, MessageCircle, Share2, Instagram, Twitter, Bookmark, UserPlus } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";

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

export default function UserProfile({ user, onClose, open }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("posts");
  
  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 data-[state=open]:animate-overlayShow z-[100]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[calc(100%-2rem)] max-w-md overflow-hidden max-h-[80vh] mt-4 flex flex-col data-[state=open]:animate-contentShow focus:outline-none z-[101]">
          <Dialog.Close className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 z-10" aria-label="Close profile">
            <X size={20} />
          </Dialog.Close>
          <Dialog.Description className="sr-only">User profile</Dialog.Description>

          {/* Header */}
          <div className="p-6 pb-2">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-20 h-20 rounded-full overflow-hidden border-2 ${user.online ? 'border-unicef' : 'border-gray-300'}`}>
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                {user.online && (
                  <div className="absolute bottom-0 right-0 bg-unicef text-white p-1 rounded-full">
                    <span className="block w-2 h-2 rounded-full" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <Dialog.Title className="text-xl font-bold">{user.name}</Dialog.Title>
                {user.specialty && <Dialog.Description className="text-sm text-gray-500">{user.specialty}</Dialog.Description>}
                
                <div className="flex gap-4 mt-2 text-sm">
                  <div>
                    <span className="font-semibold">{user.followers || 0}</span> followers
                  </div>
                  <div>
                    <span className="font-semibold">{user.following || 0}</span> following
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-unicef text-white px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-1">
                <UserPlus size={16} />
                Follow
              </button>
              <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm font-medium">
                Book Session
              </button>
              <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm font-medium">
                Send Gift
              </button>
            </div>
            
            {user.socialMedia && (
              <div className="flex gap-3 mt-4 justify-center">
                {user.socialMedia.instagram && (
                  <a href={user.socialMedia.instagram} className="text-gray-600 hover:text-pink-600" target="_blank" rel="noopener noreferrer">
                    <Instagram size={20} />
                  </a>
                )}
                {user.socialMedia.twitter && (
                  <a href={user.socialMedia.twitter} className="text-gray-600 hover:text-unicef" target="_blank" rel="noopener noreferrer">
                    <Twitter size={20} />
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
            <Tabs.List className="flex border-b border-gray-200">
              <Tabs.Trigger 
                value="posts" 
                className={`flex-1 py-3 text-sm font-medium ${activeTab === "posts" ? "text-unicef border-b-2 border-unicef relative -mb-[2px]" : "text-gray-600"}`}
              >
                Posts
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="services" 
                className={`flex-1 py-3 text-sm font-medium ${activeTab === "services" ? "text-unicef border-b-2 border-unicef relative -mb-[2px]" : "text-gray-600"}`}
              >
                Services
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="about" 
                className={`flex-1 py-3 text-sm font-medium ${activeTab === "about" ? "text-unicef border-b-2 border-unicef relative -mb-[2px]" : "text-gray-600"}`}
              >
                About
              </Tabs.Trigger>
            </Tabs.List>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <Tabs.Content value="posts" className="space-y-6 outline-none">
                {user.posts && user.posts.length > 0 ? (
                  user.posts.map(post => (
                    <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="relative h-64 w-full">
                        <Image
                          src={post.image}
                          alt={post.caption}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm">{post.caption}</p>
                        <div className="flex justify-between mt-3 text-gray-500 text-sm">
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
                        <p className="text-xs text-gray-400 mt-2">{post.timestamp}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No posts yet
                  </div>
                )}
              </Tabs.Content>
              
              <Tabs.Content value="services" className="space-y-4 outline-none">
                {user.services && user.services.length > 0 ? (
                  user.services.map((service, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{service.title}</h3>
                        <span className="text-unicef font-semibold">{service.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                      <button className="mt-3 w-full bg-unicef text-white py-2 rounded-lg text-sm font-medium">
                        Book Now
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No services available
                  </div>
                )}
              </Tabs.Content>
              
              <Tabs.Content value="about" className="space-y-4 outline-none">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h3 className="font-medium mb-2">Bio</h3>
                  <p className="text-sm text-gray-700">{user.bio || 'No bio available'}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h3 className="font-medium mb-2">Specialty</h3>
                  <p className="text-sm text-gray-700">{user.specialty || 'Not specified'}</p>
                </div>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
