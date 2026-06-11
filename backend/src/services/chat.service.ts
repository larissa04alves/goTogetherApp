import { StreamChat } from "stream-chat";

import { env } from "@/env";

const serverClient = StreamChat.getInstance(
  env.STREAM_API_KEY,
  env.STREAM_API_SECRET,
);

const CHANNEL_TYPE = "messaging";

function channelIdForHub(hubId: string): string {
  return `hub-${hubId}`;
}

type StreamUser = {
  id: string;
  name: string;
  image?: string | undefined;
};

async function issueToken(user: StreamUser): Promise<string> {
  await serverClient.upsertUser({
    id: user.id,
    name: user.name,
    image: user.image,
  });

  return serverClient.createToken(user.id);
}

async function ensureHubChannel(
  hubId: string,
  userId: string,
  name?: string,
): Promise<{ channelType: string; channelId: string }> {
  const channelId = channelIdForHub(hubId);

  const channel = serverClient.channel(CHANNEL_TYPE, channelId, {
    created_by_id: userId,
    ...(name ? { name } : {}),
  });

  await channel.create();
  await channel.addMembers([userId]);

  return { channelType: CHANNEL_TYPE, channelId };
}

export const chatService = { issueToken, ensureHubChannel };
