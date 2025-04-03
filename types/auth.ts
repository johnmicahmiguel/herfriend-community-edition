import { User } from "@prisma/client";
import { User as FirebaseUser } from "firebase/auth";

export interface LoginModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface LobbyAuthListenerProps {
  lobbyId: string;
  updateUserData: (userData: User | null) => void;
}

export interface AuthState {
  userId: string | null;
  isAnonymous: boolean;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  isAnonymous: boolean;
  signInWithGoogle: () => Promise<AuthResponse | void>;
  autoSignInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  googleSignInProgress: boolean;
}
