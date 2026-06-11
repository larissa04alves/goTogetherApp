import { createContext, use, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { StreamChat } from "stream-chat";
import { useCreateChatClient } from "stream-chat-react";

import { authClient } from "@/api/auth";
import { fetchStreamToken } from "@/api/chat";
import type { StreamCredentials } from "@/api/chat";

const ChatClientContext = createContext<StreamChat | null>(null);

export function useChatClient(): StreamChat | null {
  return use(ChatClientContext);
}

type ChatProviderProps = {
  children: ReactNode;
};

export function ChatProvider({ children }: ChatProviderProps) {
  const { data } = authClient.useSession();
  const [credentials, setCredentials] = useState<StreamCredentials | null>(null);

  useEffect(() => {
    if (!data) {
      setCredentials(null);
      return;
    }

    let active = true;
    fetchStreamToken()
      .then((creds) => {
        if (active) setCredentials(creds);
      })
      .catch(() => {
        if (active) setCredentials(null);
      });

    return () => {
      active = false;
    };
  }, [data]);

  if (!data || !credentials) {
    return (
      <ChatClientContext.Provider value={null}>
        {children}
      </ChatClientContext.Provider>
    );
  }

  return (
    <ConnectedChatProvider
      credentials={credentials}
      name={data.user.name}
      image={data.user.image ?? undefined}
    >
      {children}
    </ConnectedChatProvider>
  );
}

type ConnectedChatProviderProps = {
  credentials: StreamCredentials;
  name: string;
  image?: string | undefined;
  children: ReactNode;
};

function ConnectedChatProvider({
  credentials,
  name,
  image,
  children,
}: ConnectedChatProviderProps) {
  const client = useCreateChatClient({
    apiKey: credentials.apiKey,
    tokenOrProvider: credentials.token,
    userData: { id: credentials.userId, name, image },
  });

  return (
    <ChatClientContext.Provider value={client}>
      {children}
    </ChatClientContext.Provider>
  );
}
