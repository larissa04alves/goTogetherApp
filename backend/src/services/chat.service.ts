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
  user: StreamUser,
  hubId: string,
  name?: string,
): Promise<{ channelType: string; channelId: string }> {
  await serverClient.upsertUser({
    id: user.id,
    name: user.name,
    image: user.image,
  });

  const channelId = channelIdForHub(hubId);

  const channel = serverClient.channel(CHANNEL_TYPE, channelId, {
    created_by_id: user.id,
    ...(name ? { name } : {}),
  });

  await channel.create();
  await channel.addMembers([user.id]);

  return { channelType: CHANNEL_TYPE, channelId };
}

async function seedHubConversation(
  hubId: string,
  participants: StreamUser[],
  messages: { userId: string; text: string }[],
): Promise<void> {
  const firstParticipant = participants[0];
  if (!firstParticipant) {
    throw new Error("seedHubConversation requer ao menos um participante.");
  }

  for (const participant of participants) {
    await serverClient.upsertUser({
      id: participant.id,
      name: participant.name,
      image: participant.image,
    });
  }

  const channelId = channelIdForHub(hubId);
  const channel = serverClient.channel(CHANNEL_TYPE, channelId, {
    created_by_id: firstParticipant.id,
  });

  await channel.create();
  await channel.addMembers(participants.map((participant) => participant.id));

  const state = await channel.query({ messages: { limit: 1 } });
  if (state.messages.length > 0) {
    return;
  }

  for (const message of messages) {
    await channel.sendMessage({ text: message.text, user_id: message.userId });
  }
}

export const chatService = {
  issueToken,
  ensureHubChannel,
  seedHubConversation,
};
