import { useEffect, useState } from "react";
import { toast } from "sonner";

import { createRota, deleteRota, fetchRotas, updateRota } from "@/api/routes";
import { ConfirmDialog } from "@/components/confirm-dialog";

import { BottomNav } from "@/components/bottom-nav";
import { EmptyRouteCard } from "./components/empty-route-card";
import { RoutesHeader } from "./components/routes-header";
import { RouteCard } from "./components/route-card";
import { RouteFormModal } from "./components/route-form-modal";
import { formToRotaInput, rotaToSavedRoute, type RouteFormValues } from "./route-adapters";
import type { SavedRoute } from "./types";

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; route: SavedRoute };

export default function RoutePage() {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [pendingDelete, setPendingDelete] = useState<SavedRoute | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    fetchRotas()
      .then((list) => {
        if (active) setRoutes(list.map(rotaToSavedRoute));
      })
      .catch((err) => {
        if (active) {
          toast.error(err instanceof Error ? err.message : "Erro ao carregar rotas");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function handleAdd() {
    setModal({ mode: "create" });
  }

  function handleEdit(route: SavedRoute) {
    setModal({ mode: "edit", route });
  }

  function handleClose() {
    setModal({ mode: "closed" });
  }

  async function handleSubmit(values: RouteFormValues) {
    const input = formToRotaInput(values);
    try {
      if (modal.mode === "create") {
        const created = await createRota(input);
        setRoutes((curr) => [...curr, rotaToSavedRoute(created)]);
        toast.success("Rota criada");
      } else if (modal.mode === "edit") {
        const updated = await updateRota(modal.route.id, input);
        setRoutes((curr) =>
          curr.map((r) => (r.id === updated.id ? rotaToSavedRoute(updated) : r)),
        );
        toast.success("Rota atualizada");
      }
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar rota");
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteRota(pendingDelete.id);
      setRoutes((curr) => curr.filter((r) => r.id !== pendingDelete.id));
      toast.success("Rota removida");
      setPendingDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover rota");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-4 px-5 pb-24 pt-8">
        <RoutesHeader onAdd={handleAdd} />
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {loading ? "Carregando…" : `${routes.length} rotas salvas`}
        </p>

        <section className="flex flex-col gap-3">
          {routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              onEdit={() => handleEdit(route)}
              onDelete={() => setPendingDelete(route)}
            />
          ))}
          {!loading ? <EmptyRouteCard onAdd={handleAdd} /> : null}
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

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remover rota"
        description={
          pendingDelete
            ? `Remover a rota ${pendingDelete.origin.label} → ${pendingDelete.destination.label}? Essa ação não pode ser desfeita.`
            : ""
        }
        destructive
        confirmLabel="Remover"
        loading={deleting}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}
