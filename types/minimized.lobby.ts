// Define the structure of a minimized lobby
export interface MinimizedLobby {
  id: string;
  name: string;
  thumbnail?: string;
  hostName?: string;
  isActive: boolean; // Whether the lobby is currently mounted and active
}

// Track which lobbies are currently active and their minimized state
export interface ActiveLobbiesState {
  [lobbyId: string]: boolean; // true = minimized, false = active and visible
}

export interface MinimizedLobbiesContextType {
  minimizedLobby: MinimizedLobby | null;
  activeLobbies: ActiveLobbiesState;
  minimizeLobby: (lobby: MinimizedLobby) => void;
  removeLobby: (lobbyId: string) => void;
  isLobbyMinimized: (lobbyId: string) => boolean;
  restoreLobby: (lobbyId: string) => void;
}
