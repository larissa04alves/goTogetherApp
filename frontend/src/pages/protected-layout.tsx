import { Navigate, Outlet } from "react-router";

import { authClient } from "@/api/auth";
import { ChatProvider } from "@/components/chat-provider";

export default function ProtectedLayout() {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ChatProvider>
      <Outlet />
    </ChatProvider>
  );
}
