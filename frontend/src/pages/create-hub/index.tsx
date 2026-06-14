import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ReactNode, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { createCarona } from "@/api/caronas";
import { fetchVehicles, type Vehicle } from "@/api/vehicles";
import { loadJSON } from "@/lib/storage";
import type { HubMode } from "@/pages/history/types";
import type { SavedRoute } from "@/pages/route/types";

import { NotesTextarea } from "./components/notes-textarea";
import { EmptyDataMessage } from "./components/empty-data-message";
import { PriceInput } from "./components/price-input";
import { RoutePicker } from "./components/route-picker";
import { SeatsStepper } from "./components/seats-stepper";
import { TimeToggle } from "./components/time-toggle";
import { VehicleCard } from "./components/vehicle-card";

function parseMode(raw: string | null): HubMode {
  return raw === "app" ? "app" : "carona";
}

export default function CreateHubPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = parseMode(searchParams.get("modo"));

  const [routes] = useState<SavedRoute[]>(() =>
    loadJSON<SavedRoute[]>("routes", []),
  );
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    let active = true;
    fetchVehicles()
      .then((list) => {
        if (active) setVehicle(list[0] ?? null);
      })
      .catch((err) => {
        if (active) toast.error(err instanceof Error ? err.message : "Erro ao carregar veículo");
      });
    return () => {
      active = false;
    };
  }, []);

  const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);
  const [useSavedTime, setUseSavedTime] = useState(true);
  const [customTime, setCustomTime] = useState("08:00");
  const [seats, setSeats] = useState(3);
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");

  const hasRoutes = routes.length > 0;
  const priceValue = Number(price.replace(",", "."));
  const validPrice = mode === "carona" ? priceValue > 0 : true;
  const canSubmit =
    selectedRoute !== null && validPrice && (mode === "app" || vehicle !== null);

  async function handleSubmit() {
    if (!selectedRoute || !canSubmit) return;
    if (mode === "carona" && !vehicle) return;
    const departureTime = useSavedTime
      ? selectedRoute.departureTime
      : customTime;

    try {
      await createCarona({
        tipo: mode === "carona" ? "carro_proprio" : "rachar_app",
        rotaId: selectedRoute.id,
        origemLabel: selectedRoute.origin.label,
        origemEndereco: selectedRoute.origin.address,
        destinoLabel: selectedRoute.destination.label,
        destinoEndereco: selectedRoute.destination.address,
        horarioSaida: departureTime,
        vagasMax: seats,
        valorPorPessoa: mode === "carona" ? Math.round(priceValue * 100) : null,
        soMulheres: false,
        veiculoId: mode === "carona" ? (vehicle?.id ?? null) : null,
      });
      toast.success("Carona criada");
      void navigate("/historico");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar carona");
    }
  }

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-5 px-5 pb-12 pt-8">
        <header className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => void navigate(-1)}
            aria-label="Voltar"
            className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={1.75} />
          </button>
          <div className="flex flex-col gap-1">
            <h1 className="text-[22px] font-bold leading-tight text-foreground">
              Cadastrar {mode === "carona" ? "carona" : "transporte"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {mode === "carona"
                ? "Compartilhe sua rota com a galera da PUCPR"
                : "Combine uma corrida de app com a galera"}
            </p>
          </div>
        </header>

        <section className="flex flex-col gap-2">
          <Label>Rota</Label>
          {hasRoutes ? (
            <RoutePicker
              routes={routes}
              selected={selectedRoute}
              onSelect={(r) => {
                setSelectedRoute(r);
                setUseSavedTime(true);
              }}
            />
          ) : (
            <EmptyDataMessage
              message="Nenhuma rota cadastrada"
              ctaLabel="Criar rota"
              onClick={() => void navigate("/rotas")}
            />
          )}
        </section>

        <section className="flex flex-col gap-2">
          <Label>Horário</Label>
          <TimeToggle
            useSaved={useSavedTime}
            onUseSavedChange={setUseSavedTime}
            customTime={customTime}
            onCustomTimeChange={setCustomTime}
            route={selectedRoute}
          />
        </section>

        <section className="flex flex-col gap-2">
          <Label>Vagas disponíveis</Label>
          <SeatsStepper value={seats} onChange={setSeats} />
        </section>

        {mode === "carona" ? (
          <>
            <section className="flex flex-col gap-2">
              <Label>Valor por passageiro</Label>
              <PriceInput value={price} onChange={setPrice} />
            </section>

            <section className="flex flex-col gap-2">
              <Label>Veículo</Label>
              {vehicle !== null ? (
                <VehicleCard vehicle={vehicle} />
              ) : (
                <EmptyDataMessage
                  message="Nenhum veículo cadastrado"
                  ctaLabel="Cadastrar veículo"
                  onClick={() => void navigate("/configuracoes")}
                />
              )}
            </section>
          </>
        ) : (
          <section className="flex flex-col gap-2">
            <Label>Observação</Label>
            <NotesTextarea value={notes} onChange={setNotes} />
          </section>
        )}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-sm font-bold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Criar carona →
        </button>
      </div>
    </main>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
      {children}
    </span>
  );
}
