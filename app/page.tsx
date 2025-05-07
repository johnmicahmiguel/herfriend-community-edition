import PromotionalBanner from "@/components/ui/PromotionalBanner";
import LobbyGrid from "@/components/lobby/LobbyGrid";
import { getLobbyList } from "@/app/actions/lobby.action";

export default async function HomePage() {
  const dbLobbies = await getLobbyList();

  // Map DB lobbies to UI Lobby type
  const lobbies = dbLobbies.map((lobby: any) => ({
    id: lobby.id,
    title: lobby.name, // DB uses 'name', UI expects 'title'
    description: lobby.description,
    hostName: lobby.host?.name || "Host", // fallback if host is not set
    thumbnail: lobby.thumbnail,
    viewerCount: lobby.viewerCount ?? 0, // Use viewerCount from DB
    category: lobby.category || "General", // fallback if category is not set
    isLive: lobby.isLive, // Use isLive from DB
    categories: lobby.categories || [],
    type: lobby.type,
  }));

  return (
    <>
      {/* Promotional banner carousel */}
      <PromotionalBanner />

      {/* Lobby grid */}
      <div className="p-4 md:p-6 w-full overflow-hidden">
        <h2 className="text-lg font-bold mb-4 text-blue-500 dark:text-gray-200">Popular Lobbies</h2>
        <LobbyGrid lobbies={lobbies} />
      </div>
    </>
  );
}
