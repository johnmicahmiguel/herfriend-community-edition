"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import AgoraRTC from "agora-rtc-react";

type BotClient = {
  id: string;
  client: any; // AgoraRTC Client
  type: "announcer" | "music" | "other";
  isConnected: boolean;
  channelName?: string;
};

type AgoraBotsContextType = {
  botClients: Map<string, BotClient>;
  createBotClient: (type: BotClient["type"], id: string) => Promise<BotClient>;
  connectBotToChannel: (
    botOrId: BotClient | string,
    channel: string,
    token: string,
  ) => Promise<BotClient>;
  disconnectBot: (botId: string) => Promise<void>;
  getBotClient: (botId: string) => BotClient | undefined;
  activeBotIds: string[];
  botCount: number;
};

const AgoraBotsContext = createContext<AgoraBotsContextType>({
  botClients: new Map(),
  createBotClient: async () => ({
    id: "",
    client: null,
    type: "other",
    isConnected: false,
  }),
  connectBotToChannel: async () => ({
    id: "",
    client: null,
    type: "other",
    isConnected: false,
  }),
  disconnectBot: async () => {},
  getBotClient: () => undefined,
  activeBotIds: [],
  botCount: 0,
});

export const AgoraBotsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [botClients, setBotClients] = useState<Map<string, BotClient>>(
    new Map(),
  );
  const botClientsRef = useRef(botClients);

  useEffect(() => {
    botClientsRef.current = botClients;
  }, [botClients]);

  const createBotClient = useCallback(
    async (type: BotClient["type"], id: string) => {
      try {
        const client = AgoraRTC.createClient({
          mode: "live",
          codec: "vp8",
        });

        const newBot: BotClient = {
          id,
          client,
          type,
          isConnected: false,
        };

        setBotClients((prev) => {
          const updated = new Map(prev);
          updated.set(id, newBot);
          return updated;
        });

        console.log(`🤖 Created bot client`, { id, type });
        return newBot;
      } catch (error) {
        console.error("Failed to create bot client:", error);
        throw error;
      }
    },
    [],
  );

  const connectBotToChannel = useCallback(
    async (botOrId: BotClient | string, channel: string, token: string) => {
      const currentBotClients = botClientsRef.current;
      let bot: BotClient | undefined =
        typeof botOrId === "string" ? currentBotClients.get(botOrId) : botOrId;

      if (!bot) {
        const id = typeof botOrId === "string" ? botOrId : "unknown";
        console.error(`Bot ${id} not found for connection.`);
        throw new Error(`Bot ${id} not found`);
      }

      const { client, id: botId } = bot;
      const currentState = client.connectionState;
      const currentTrackedChannel = bot.channelName;

      console.log(
        `[Context] connectBotToChannel requested for ${botId}. Current State: ${currentState}, Current Channel: ${currentTrackedChannel}, Target Channel: ${channel}`,
      );

      try {
        if (currentState === "CONNECTED" && currentTrackedChannel === channel) {
          console.log(
            `[Context] Bot ${botId} already connected to target channel ${channel}. No action needed.`,
          );
          return bot;
        }

        if (currentState === "CONNECTING" || currentState === "RECONNECTING") {
          console.warn(
            `[Context] Bot ${botId} is currently ${currentState}. Join attempt skipped.`,
          );
          return bot;
        }

        if (currentState === "CONNECTED" && currentTrackedChannel !== channel) {
          console.log(
            `[Context] Bot ${botId} connected to ${currentTrackedChannel}, switching to ${channel}. Leaving first...`,
          );
          try {
            await client.leave();
            console.log(
              `[Context] Bot ${botId} left ${currentTrackedChannel}.`,
            );
            const updatedBotAfterLeave: BotClient = {
              ...bot!,
              isConnected: false,
              channelName: undefined,
            };
            setBotClients((prev) =>
              new Map(prev).set(botId, updatedBotAfterLeave),
            );
            bot = updatedBotAfterLeave;
          } catch (leaveError) {
            console.error(
              `[Context] Error leaving channel ${currentTrackedChannel} for bot ${botId}:`,
              leaveError,
            );
            throw new Error(
              `Failed to leave previous channel ${currentTrackedChannel}: ${leaveError}`,
            );
          }
        }

        console.log(
          `[Context] Setting client role and joining channel ${channel} for bot ${botId}...`,
        );
        await client.setClientRole("host");

        await client.join(
          process.env.NEXT_PUBLIC_AGORA_APP_ID!,
          channel,
          token,
          botId,
        );

        const updatedBot: BotClient = {
          ...bot,
          isConnected: true,
          channelName: channel,
        };

        setBotClients((prev) => {
          const updatedMap = new Map(prev);
          updatedMap.set(botId, updatedBot);
          return updatedMap;
        });

        console.log(
          `[Context] Bot ${botId} successfully connected to channel ${channel} as host.`,
        );
        return updatedBot;
      } catch (error) {
        console.error(
          `[Context] Failed connection process for bot ${botId} to channel ${channel}:`,
          error,
        );
        const failedBot = { ...bot, isConnected: false };
        setBotClients((prev) => {
          const currentBot = prev.get(botId);
          if (currentBot) {
            const updated = new Map(prev);
            updated.set(botId, { ...currentBot, isConnected: false });
            return updated;
          }
          return prev;
        });
        throw error;
      }
    },
    [],
  );

  const disconnectBot = useCallback(async (botId: string) => {
    const currentBotClients = botClientsRef.current;
    const bot = currentBotClients.get(botId);
    if (!bot) return;

    try {
      await bot.client.leave();
      setBotClients((prev) => {
        const updated = new Map(prev);
        const currentBot = prev.get(botId);
        if (currentBot) {
          updated.set(botId, {
            ...currentBot,
            isConnected: false,
            channelName: undefined,
          });
        }
        return updated;
      });

      console.log(`🤖 Bot disconnected`, { botId });
    } catch (error) {
      console.error("Failed to disconnect bot:", error);
      throw error;
    }
  }, []);

  const getBotClient = useCallback((botId: string) => {
    return botClientsRef.current.get(botId);
  }, []);

  const activeBotIds = Array.from(botClients.keys());
  const botCount = botClients.size;

  return (
    <AgoraBotsContext.Provider
      value={{
        botClients,
        createBotClient,
        connectBotToChannel,
        disconnectBot,
        getBotClient,
        activeBotIds,
        botCount,
      }}
    >
      {children}
    </AgoraBotsContext.Provider>
  );
};

export const useAgoraBots = () => useContext(AgoraBotsContext);
