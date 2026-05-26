import { ArrowLeft01Icon, Car03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { SettingsItem } from "./components/settings-item";
import { VehicleFormModal } from "./components/vehicle-form-modal";
import type { Vehicle } from "./types";

export default function ConfiguracoesPage() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function handleSubmit(next: Vehicle) {
    setVehicle(next);
    setModalOpen(false);
    toast.success(vehicle ? "Veículo atualizado" : "Veículo cadastrado");
  }

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
            description={
              vehicle
                ? `${vehicle.model} · ${vehicle.color} · ${vehicle.plate}`
                : "Informe modelo, cor e placa do seu carro"
            }
            onClick={() => setModalOpen(true)}
          />
        </section>
      </div>

      <VehicleFormModal
        open={modalOpen}
        initialVehicle={vehicle}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
