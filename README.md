# Social Lobby App

A modern, full-stack social platform where users can join themed lobbies, chat, book hosts, complete missions, and manage their profiles and wallets. Built with Next.js, React, Prisma, Firebase, and TailwindCSS.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
- [Development Notes](#development-notes)
- [License](#license)

---

## Features

- **Lobby System:** Join public lobbies, interact with hosts and co-hosts, and participate in live chat and video/voice sessions.
- **User Authentication:** Google OAuth and anonymous sign-in via Firebase, with session management.
- **Profile Management:** Users can edit their profiles, view posts, and manage social links.
- **Wallet:** Integrated wallet for managing virtual currency and transactions.
- **Booking System:** Book private sessions with hosts.
- **Missions & Gamification:** Daily, weekly, and one-time missions to engage users and reward activity.
- **Private Messaging:** Real-time chat and private messaging powered by Firebase Realtime Database.
- **Responsive UI:** Built with TailwindCSS and Radix UI for a modern, accessible experience.
- **Theming:** Light/dark mode support.

---

## Architecture Overview

### Frontend

- **Next.js App Router** (`app/`): Handles routing, layouts, and server/client components.
- **Components** (`components/`): Modular UI components for lobbies, user profiles, chat, etc.
- **State Management:** React context providers for authentication, sidebar, and Agora (video/voice).
- **Theming:** Managed via `next-themes`.

### Backend

- **API Routes** (`app/api/`): Next.js API endpoints for authentication, wallet top-ups, and more.
- **Database:** MongoDB accessed via Prisma ORM. User data is stored in the `users` collection.
- **Firebase:** Used for authentication (Google, anonymous), real-time chat, and private messaging.
- **Agora:** For real-time video and voice features in lobbies.

### Data Model

- **User:** Central model with fields for authentication, profile, roles, wallet, and activity.
- **Lobby:** Dynamic, with chat, video, and voice features.
- **Missions:** Tracked per user for gamification.

---

## Tech Stack

- **Frontend:** Next.js, React, TailwindCSS, Radix UI, Lucide Icons
- **Backend:** Next.js API, Prisma, MongoDB, Firebase, Agora
- **Auth:** Firebase Auth, Google OAuth, Privy
- **Other:** PostCSS, Prettier, ESLint, TypeScript

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm
- MongoDB instance (local or cloud)
- Firebase project (for Auth and Realtime Database)
- Agora account (for video/voice features)

### Environment Variables

Create a `.env.local` file in the root with the following (see `lib/firebase/config.ts` and `prisma/schema.prisma`):

```env
# MongoDB
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"

# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...

# Firebase (Admin)
FB_CLIENT_EMAIL=...
FB_PRIVATE_KEY=...

# Agora
NEXT_PUBLIC_AGORA_APP_ID=...
NEXT_PUBLIC_AGORA_TOKEN=...

# (Add any other required keys)
```

### Installation

```bash
yarn install
# or
npm install
```

### Database Setup

- Edit `prisma/schema.prisma` if needed.
- Generate the Prisma client:

```bash
yarn schema:generate
# or
npx prisma generate
```

- (Optional) Use Prisma Studio to inspect your DB:

```bash
npx prisma studio
```

### Running the App

```bash
yarn dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
.
├── app/                # Next.js app directory (routing, pages, API)
│   ├── (auth)/         # Auth-related routes
│   ├── (protected)/    # Authenticated user routes (profile, wallet, bookings, missions)
│   ├── lobby/          # Lobby pages
│   ├── api/            # API routes (auth, wallet, etc.)
│   └── ...             # Layout, error, loading, etc.
├── components/         # UI and feature components
├── lib/                # Utilities, context providers, Firebase, Prisma
├── prisma/             # Prisma schema and migrations
├── public/             # Static assets (images, audio)
├── styles/             # Global and component styles
├── types/              # TypeScript types
├── package.json
├── tsconfig.json
└── README.md
```

---

## Core Concepts

### Authentication

- Uses Firebase Auth for Google and anonymous sign-in.
- Auth state is managed via React context (`lib/context/auth.context.tsx`).
- Sessions are created on the server for authenticated users.

### Lobbies

- Users can join themed lobbies, interact via chat, video, or voice.
- Lobby data and chat are managed via Firebase Realtime Database.
- Video/voice powered by Agora.

### Missions & Gamification

- Users complete daily, weekly, and one-time missions for XP, coins, and items.
- Progress is tracked and displayed in the Mission Center.

### Wallet

- Users have a wallet for virtual currency.
- Top-up and transaction features are available.

### Bookings

- Users can book private sessions with hosts.
- Booking data is managed and displayed in the user dashboard.

### Messaging

- Real-time chat in lobbies and private messaging between users.
- Powered by Firebase Realtime Database.

---

## Development Notes

- **TypeScript:** Strictly typed for safety and maintainability.
- **Prisma:** Used for all persistent user data (MongoDB).
- **Firebase:** Used for real-time features and authentication.
- **Agora:** Used for real-time video/voice in lobbies.
- **Theming:** Easily switch between light and dark modes.
- **Testing:** (Add your testing strategy here if applicable.)

---

## License

See [LICENSE](LICENSE) for details.

---

**Contributions welcome!** Please open issues or pull requests for improvements or bug fixes.
