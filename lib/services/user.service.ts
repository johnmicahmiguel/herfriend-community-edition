import { prisma } from "@/lib/prisma";
import { User as FirebaseUser } from "firebase/auth";
import { Prisma, User } from "@prisma/client";

// Function to generate a random profile picture URL
function generateProfilePicture(): string {
  const styles = ["bottts", "avataaars", "shapes", "thumbs", "abstract"];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  const seed = Math.random().toString(36).substring(2, 10); // Random seed
  return `https://api.dicebear.com/7.x/${randomStyle}/png?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export async function createOrUpdateUser(user: FirebaseUser) {
  const { uid, email, displayName } = user;

  if (!email) {
    throw new Error("User email is required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { uid },
  });

  // Only generate a profile picture if the user is new or doesn't have one
  const profilePic = existingUser?.profilePic || generateProfilePicture();

  return await prisma.user.upsert({
    where: { uid },
    update: {
      updatedAt: new Date(),
    },
    create: {
      uid,
      email,
      username: displayName || `user_${uid.slice(0, 8)}`,
      profilePic,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

/**
 * Get a user by their UID
 * @param uid The UID of the user to get
 * @returns The user or null if not found
 */
export async function getUserByUid(uid: string) {
  console.log("getUserByUid", uid);
  if (!uid) {
    throw new Error("User UID is required");
  }

  return await prisma.user.findUnique({
    where: { uid },
  });
}

/**
 * Search users by name or email for messaging
 * This should be used with the index recommendation:
 * db.User.createIndex({ email: 1, name: 1 })
 *
 * @param currentUserUid The current user's UID (to exclude from results)
 * @param query Search query for name or email
 * @param page Page number (1-based)
 * @param limit Number of results per page
 * @returns Paginated list of users matching the search criteria
 */
export async function searchUsers(
  currentUserUid: string,
  query: string,
  page: number = 1,
  limit: number = 10,
): Promise<{
  users: Array<{
    uid: string;
    username: string;
    email: string;
    profilePic: string | null;
    createdAt: Date;
  }>;
  total: number;
  hasMore: boolean;
}> {
  const skip = (page - 1) * limit;

  // Create the search conditions
  let whereCondition: Prisma.UserWhereInput = {
    NOT: { uid: currentUserUid },
  };

  // Add search query conditions if a query is provided
  if (query && query.trim() !== "") {
    whereCondition = {
      ...whereCondition,
      OR: [
        { email: { contains: query, mode: "insensitive" as Prisma.QueryMode } },
        {
          username: {
            contains: query,
            mode: "insensitive" as Prisma.QueryMode,
          },
        },
        { uid: { contains: query, mode: "insensitive" as Prisma.QueryMode } },
      ],
    };
  }

  // Count total users matching the criteria
  const total = await prisma.user.count({
    where: whereCondition,
  });

  // Get paginated results
  const users = await prisma.user.findMany({
    where: whereCondition,
    select: {
      uid: true,
      username: true,
      email: true,
      profilePic: true,
      createdAt: true,
    },
    orderBy: { username: "asc" },
    skip,
    take: limit,
  });

  return {
    users,
    total,
    hasMore: skip + users.length < total,
  };
}
