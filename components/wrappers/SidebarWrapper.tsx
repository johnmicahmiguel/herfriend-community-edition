import SideBar from "@/components/ui/SideBar";
import { getLobbyList } from "@/app/actions/lobby.action";

export default async function SidebarWrapper() {
  const dbLobbies = await getLobbyList();
  // Map DB lobbies to UI Lobby type
  const lobbies = dbLobbies.map((lobby: any) => ({
    id: lobby.id,
    title: lobby.name,
    description: lobby.description,
    hostName: lobby.host?.name || "Host",
    thumbnail: lobby.thumbnail,
    viewerCount: lobby.viewerCount ?? 0,
    isLive: lobby.isLive,
    categories: lobby.categories || [],
    type: lobby.type,
  }));
  return <SideBar lobbies={lobbies} />;
} 