import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { authClient } from "@/api/auth";
import {
  cancelarHub,
  concluirHub,
  expulsarMembro,
  fetchMeusHubs,
  sairHub,
  type MeuHub,
} from "@/api/hubs";
import { BottomNav } from "@/components/bottom-nav";

import { EmptyHubs } from "./components/empty-hubs";
import { MinhaCaronaCard } from "./components/minha-carona-card";

export default function HistoryPage() {
  const navigate = useNavigate();
  const { data } = authClient.useSession();
  const currentUserId = data?.user?.id;
  const [hubs, setHubs] = useState<MeuHub[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setHubs(await fetchMeusHubs());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar caronas");
    }
  }

  useEffect(() => {
    let active = true;
    fetchMeusHubs()
      .then((list) => {
        if (active) setHubs(list);
      })
      .catch((err) => {
        if (active) {
          toast.error(
            err instanceof Error ? err.message : "Erro ao carregar caronas",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function withRefresh(
    action: () => Promise<unknown>,
    successMsg: string,
  ) {
    try {
      await action();
      toast.success(successMsg);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível concluir a ação");
    }
  }

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-4 px-5 pb-24 pt-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold leading-tight text-foreground">
            Minhas caronas
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            {hubs.length} {hubs.length === 1 ? "carona" : "caronas"}
          </p>
        </header>

        {loading ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Carregando…
          </p>
        ) : hubs.length === 0 ? (
          <EmptyHubs onCreate={() => navigate("/hubs/novo")} />
        ) : (
          <section className="flex flex-col gap-3">
            {hubs.map((hub) => (
              <MinhaCaronaCard
                key={hub.id}
                hub={hub}
                currentUserId={currentUserId}
                onOpenChat={(id) => navigate(`/chat/${id}`)}
                onKick={(hubId, membroId) =>
                  withRefresh(
                    () => expulsarMembro(hubId, membroId),
                    "Membro removido",
                  )
                }
                onLeave={(hubId) =>
                  withRefresh(() => sairHub(hubId), "Você saiu do hub")
                }
                onComplete={(hubId) =>
                  withRefresh(() => concluirHub(hubId), "Hub concluído")
                }
                onCancel={(hubId) =>
                  withRefresh(() => cancelarHub(hubId), "Hub cancelado")
                }
              />
            ))}
          </section>
        )}
      </div>

      <BottomNav active="history" />
    </main>
  );
}
