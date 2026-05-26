import { useState } from "react";
import { toast } from "sonner";

import { BottomNav } from "../../components/bottom-nav";
import { EmptyRouteCard } from "./components/empty-route-card";
import { RotasHeader } from "./components/rotas-header";
import { RouteCard } from "./components/route-card";
import { RouteFormModal } from "./components/route-form-modal";
import { mockSavedRoutes } from "./mock";
import type { Endpoint, SavedRoute } from "./types";

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; route: SavedRoute };

function inferKind(label: string, fallback: Endpoint["kind"]): Endpoint["kind"] {
  const normalized = label.trim().toLowerCase();
  if (normalized === "casa") return "home";
  if (normalized === "trabalho") return "work";
  return fallback;
}

export default function RotasPage() {
  const [routes, setRoutes] = useState<SavedRoute[]>(mockSavedRoutes);
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  function handleAdd() {
    setModal({ mode: "create" });
  }

  function handleEdit(route: SavedRoute) {
    setModal({ mode: "edit", route });
  }

  function handleClose() {
    setModal({ mode: "closed" });
  }

  function handleSubmit(values: {
    originLabel: string;
    originAddress: string;
    destinationLabel: string;
    destinationAddress: string;
    departureTime: string;
  }) {
    if (modal.mode === "create") {
      const newRoute: SavedRoute = {
        id: crypto.randomUUID(),
        origin: {
          label: values.originLabel,
          address: values.originAddress,
          kind: "origin",
        },
        destination: {
          label: values.destinationLabel,
          address: values.destinationAddress,
          kind: inferKind(values.destinationLabel, "home"),
        },
        departureTime: values.departureTime,
        distanceKm: 0,
      };
      setRoutes((curr) => [...curr, newRoute]);
      toast.success("Rota criada");
    } else if (modal.mode === "edit") {
      setRoutes((curr) =>
        curr.map((r) =>
          r.id === modal.route.id
            ? {
                ...r,
                origin: {
                  ...r.origin,
                  label: values.originLabel,
                  address: values.originAddress,
                },
                destination: {
                  ...r.destination,
                  label: values.destinationLabel,
                  address: values.destinationAddress,
                  kind: inferKind(values.destinationLabel, r.destination.kind),
                },
                departureTime: values.departureTime,
              }
            : r,
        ),
      );
      toast.success("Rota atualizada");
    }
    handleClose();
  }

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-4 px-5 pb-24 pt-8">
        <RotasHeader onAdd={handleAdd} />
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {routes.length} rotas salvas
        </p>

        <section className="flex flex-col gap-3">
          {routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              onEdit={() => handleEdit(route)}
            />
          ))}
          <EmptyRouteCard onAdd={handleAdd} />
        </section>
      </div>
      <BottomNav active="routes" />

      <RouteFormModal
        open={modal.mode !== "closed"}
        initialRoute={modal.mode === "edit" ? modal.route : null}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
