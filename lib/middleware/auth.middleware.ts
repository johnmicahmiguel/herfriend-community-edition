"use server";

import { getSession } from "@/app/actions/auth.action";

/**
 * Middleware to protect server actions with authentication
 * @param handler The server action handler function
 * @returns A wrapped function that checks authentication before executing the handler
 */
export async function withAuth<T extends (...args: any[]) => Promise<any>>(
  handler: T,
): Promise<(...args: Parameters<T>) => Promise<ReturnType<T>>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // Get the current session
    const session = await getSession();

    // If no session, return an error
    if (!session) {
      throw new Error("Unauthorized: Authentication required");
    }

    // Execute the handler with the original arguments
    return handler(...args);
  };
}

/**
 * Middleware to protect server actions with authentication and provide the user ID
 * @param handler The server action handler function that requires the user ID
 * @returns A wrapped function that checks authentication and provides the user ID
 */
export async function withAuthUser<
  T extends (uid: string, ...args: any[]) => Promise<any>,
>(
  handler: T,
): Promise<(...args: Omit<Parameters<T>, 0>[]) => Promise<ReturnType<T>>> {
  return async (...args: Omit<Parameters<T>, 0>[]): Promise<ReturnType<T>> => {
    // Get the current session
    const session = await getSession();

    // If no session, return an error
    if (!session) {
      throw new Error("Unauthorized: Authentication required");
    }

    // Execute the handler with the user ID and the original arguments
    return handler(session.uid, ...args);
  };
}
