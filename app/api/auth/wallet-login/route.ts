import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { prisma } from "@/lib/prisma";

function generateEmail(walletAddress: string) {
  return `wallet_${walletAddress}@walletuser.local`;
}

function generateUsername(walletAddress: string) {
  return `wallet_${walletAddress.slice(0, 8)}`;
}

function generateProfilePic(walletAddress: string) {
  return `https://api.dicebear.com/7.x/bottts/png?seed=${walletAddress}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { walletAddress } = body;
  if (!walletAddress) {
    return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
  }

  const email = generateEmail(walletAddress);

  // 1. Find or create Firebase user
  let firebaseUser;
  try {
    firebaseUser = await adminAuth.getUserByEmail(email);
  } catch (e) {
    // If not found, create
    firebaseUser = await adminAuth.createUser({
      email,
      emailVerified: false,
      displayName: generateUsername(walletAddress),
      photoURL: generateProfilePic(walletAddress),
      disabled: false,
    });
  }

  const uid = firebaseUser.uid;

  // 2. Create or update user in Prisma
  await prisma.user.upsert({
    where: { uid },
    update: {
      walletAddress,
      updatedAt: new Date(),
    },
    create: {
      uid,
      email,
      username: generateUsername(walletAddress),
      profilePic: generateProfilePic(walletAddress),
      walletAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 3. Create a Firebase custom token
  const customToken = await adminAuth.createCustomToken(uid, {
    walletAddress,
    loginMethod: "wallet",
  });

  return NextResponse.json({ token: customToken });
} 