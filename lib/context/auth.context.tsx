"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import {
  createServerSession,
  signOut as serverSignOut,
} from "@/app/actions/auth.action";
import { AuthContextType } from "@/types/auth";
import { useLogin, usePrivy } from "@privy-io/react-auth";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAnonymous: false,
  signInWithGoogle: async () => {},
  autoSignInAnonymously: async () => {},
  signOut: async () => {},
  googleSignInProgress: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [googleSignInProgress, setGoogleSignInProgress] = useState(false);
  const { logout: privyLogout, authenticated: privyAuthenticated } = usePrivy();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth checker");
      setUser(user);
      setIsAnonymous(user?.isAnonymous || false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setGoogleSignInProgress(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });
      const result = await signInWithPopup(auth, provider);

      // Get the ID token
      const idToken = await result.user.getIdToken();

      // Create a session on the server and store user in database
      const response = await createServerSession(idToken);

      if (!response.success) {
        throw new Error(response.error || "Failed to create session");
      }

      // Call PF API for authentication
      if (response.decodedToken && !response.decodedToken.isAnonymous) {
        try {
          console.log("Authenticating with PF API...");
          console.log("PF API authentication successful:");
        } catch (error) {
          console.error("Error authenticating with PF API:", error);
          // Don't throw here as we want the main authentication to succeed even if PF fails
        }
      }

      return response;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);

      // Handle specific error types
      if (error.code === "auth/popup-closed-by-user") {
        // User closed the popup, no need to show an error
        console.log("Popup closed by user");
        return;
      }

      // For other errors, you might want to show a notification
      throw error;
    } finally {
      // Add a small buffer to prevent UI flicker
      setTimeout(() => {
        setGoogleSignInProgress(false);
      }, 300);
    }
  }, []);

  const autoSignInAnonymously = useCallback(async () => {
    // Only sign in anonymously if there's no user already
    if (!user) {
      try {
        const result = await signInAnonymously(auth);

        // Get the ID token
        const idToken = await result.user.getIdToken();

        // Create a session on the server
        // Note: Anonymous users are NOT saved in the database
        const response = await createServerSession(idToken);

        if (!response.success) {
          throw new Error(response.error || "Failed to create session");
        }

        // Session token is already stored in an HTTP-only cookie by the server
        console.log("Signed in anonymously");
      } catch (error) {
        console.error("Error signing in anonymously:", error);
      }
    }
  }, [user]);

  /**
   * Signs out the current user
   */
  const signOut = useCallback(async () => {
    try {
      // Dispatch a custom event before signing out to allow components to clean up
      const beforeSignOutEvent = new Event("beforeSignOut");
      window.dispatchEvent(beforeSignOutEvent);

      // Add a small delay to allow components to handle the event
      await new Promise((resolve) => setTimeout(resolve, 500));

      // If authenticated with Privy, log out from Privy as well
      if (privyAuthenticated && typeof privyLogout === "function") {
        await privyLogout();
      }

      // Perform the actual sign out (Firebase and server)
      console.log("Signing out user");
      await firebaseSignOut(auth);
      await serverSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [privyAuthenticated, privyLogout]);

  const authContextValue = useMemo(
    () => ({
      user,
      loading,
      isAnonymous,
      signInWithGoogle,
      autoSignInAnonymously,
      signOut,
      googleSignInProgress,
    }),
    [
      user,
      loading,
      isAnonymous,
      signInWithGoogle,
      autoSignInAnonymously,
      signOut,
      googleSignInProgress,
    ],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
