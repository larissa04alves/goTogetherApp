import { ArrowLeft01Icon, Car03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  createVehicle,
  fetchVehicles,
  updateVehicle,
  type Vehicle,
  type VehicleInput,
} from "@/api/vehicles";
import { SettingsItem } from "./components/settings-item";
import { VehicleFormModal } from "./components/vehicle-form-modal";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetchVehicles()
      .then((list) => {
        if (active) setVehicle(list[0] ?? null);
      })
      .catch((err) => {
        if (active) toast.error(err instanceof Error ? err.message : "Erro ao carregar veículo");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(input: VehicleInput) {
    setSaving(true);
    try {
      const saved = vehicle ? await updateVehicle(vehicle.id, input) : await createVehicle(input);
      setVehicle(saved);
      setModalOpen(false);
      toast.success(vehicle ? "Veículo atualizado" : "Veículo cadastrado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar veículo");
    } finally {
      setSaving(false);
    }
  }

  const description = loading
    ? "Carregando…"
    : vehicle
      ? `${vehicle.modelo} · ${vehicle.cor} · ${vehicle.placa}`
      : "Informe marca, modelo, cor, placa e lugares do seu carro";

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-5 px-5 pb-12 pt-8">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={1.75} />
          </button>
          <h1 className="text-[22px] font-bold leading-tight text-foreground">
            Configurações
          </h1>
        </header>

        <section className="flex flex-col gap-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Conta
          </p>
          <SettingsItem
            icon={Car03Icon}
            title={vehicle ? "Editar veículo" : "Cadastrar veículo"}
            description={description}
            onClick={() => {
              if (!loading) setModalOpen(true);
            }}
          />
        </section>
      </div>

      <VehicleFormModal
        open={modalOpen}
        initialVehicle={vehicle}
        submitting={saving}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
