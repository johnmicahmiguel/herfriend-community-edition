"use client";

import UserProfileContent from "../../../components/user/UserProfileContent";

const mockUser = {
  id: "1",
  name: "Jane Doe",
  avatar: "/images/logo-square2.png",
  bio: "Passionate developer and designer.",
  specialty: "Full Stack Developer",
  online: true,
  followers: 120,
  following: 80,
  posts: [
    {
      id: "post1",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000",
      caption: "Excited to join this platform!",
      likes: 34,
      comments: 5,
      timestamp: "2025-04-06 10:00 AM",
    },
  ],
  services: [
    {
      title: "1-on-1 Mentoring",
      price: "$50/hr",
      description: "Personalized mentoring sessions.",
    },
  ],
  socialMedia: {
    instagram: "https://instagram.com/janedoe",
    twitter: "https://twitter.com/janedoe",
  },
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <UserProfileContent user={mockUser} className="max-w-4xl" />
    </div>
  );
}
