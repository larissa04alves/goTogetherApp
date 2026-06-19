import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import {
  Channel,
  Chat,
  MessageComposer,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import { joinHubChannel } from "@/api/chat";
import { useChatClient } from "@/components/chat-provider";
import { Loader } from "@/components/loader";

export default function ChatPage() {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const client = useChatClient();
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hubId) return;

    let active = true;
    joinHubChannel(hubId)
      .then(() => {
        if (active) setJoined(true);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao abrir o chat");
        }
      });

    return () => {
      active = false;
    };
  }, [hubId]);

  const channel = useMemo(() => {
    if (!client || !hubId) return null;
    return client.channel("messaging", `hub-${hubId}`);
  }, [client, hubId]);

  if (!hubId) {
    return <Navigate to="/home" replace />;
  }

  return (
    <main className="flex h-svh w-full flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={1.75} />
        </button>
        <h1 className="text-[15px] font-bold text-foreground">Chat do hub</h1>
      </header>

      <div className="relative flex-1 min-h-0 [&>.str-chat]:h-full">
        {error ? (
          <div className="grid h-full place-items-center px-6 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : !client || !channel || !joined ? (
          <Loader />
        ) : (
          <Chat client={client} theme="str-chat__theme-light">
            <Channel channel={channel}>
              <Window>
                <MessageList />
                <MessageComposer />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        )}
      </div>
    </main>
  );
}
