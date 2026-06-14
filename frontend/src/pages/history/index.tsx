import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { fetchMinhasCaronas, type MinhaCarona } from "@/api/caronas";
import { BottomNav } from "@/components/bottom-nav";

import { EmptyHubs } from "./components/empty-hubs";
import { MinhaCaronaCard } from "./components/minha-carona-card";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [caronas, setCaronas] = useState<MinhaCarona[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchMinhasCaronas()
      .then((list) => {
        if (active) setCaronas(list);
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

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-4 px-5 pb-24 pt-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold leading-tight text-foreground">
            Minhas caronas
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            {caronas.length} {caronas.length === 1 ? "criada" : "criadas"}
          </p>
        </header>

        {loading ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Carregando…
          </p>
        ) : caronas.length === 0 ? (
          <EmptyHubs onCreate={() => navigate("/hubs/novo")} />
        ) : (
          <section className="flex flex-col gap-3">
            {caronas.map((carona) => (
              <MinhaCaronaCard
                key={carona.id}
                carona={carona}
                onOpenChat={(id) => navigate(`/chat/${id}`)}
              />
            ))}
          </section>
        )}
      </div>

      <BottomNav active="history" />
    </main>
  );
}
