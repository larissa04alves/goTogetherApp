import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ReactNode, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { authClient } from "@/api/auth";
import { createHub } from "@/api/hubs";
import { fetchRotas } from "@/api/rotas";
import { fetchVehicles, type Vehicle } from "@/api/vehicles";
import type { HubMode } from "@/pages/history/types";
import { rotaToSavedRoute } from "@/pages/route/map";
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

  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    let active = true;
    fetchRotas()
      .then((list) => {
        if (active) setRoutes(list.map(rotaToSavedRoute));
      })
      .catch((err) => {
        if (active)
          toast.error(err instanceof Error ? err.message : "Erro ao carregar rotas");
      });
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
  const [womenOnly, setWomenOnly] = useState(false);

  const { data } = authClient.useSession();
  const isFeminino = data?.user?.gender === "feminino";

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
      if (mode === "carona") {
        if (!vehicle) return;
        await createHub({
          tipo: "carro_proprio",
          rota_id: selectedRoute.id,
          horario_saida: departureTime,
          vagas_max: seats,
          so_mulheres: isFeminino ? womenOnly : false,
          veiculo_id: vehicle.id,
          valor_por_pessoa: Math.round(priceValue * 100),
        });
      } else {
        await createHub({
          tipo: "rachar_app",
          rota_id: selectedRoute.id,
          horario_saida: departureTime,
          vagas_max: seats,
          so_mulheres: isFeminino ? womenOnly : false,
        });
      }
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

        {isFeminino ? (
          <section className="flex flex-col gap-2">
            <Label>Exclusividade</Label>
            <button
              type="button"
              role="switch"
              aria-checked={womenOnly}
              onClick={() => setWomenOnly((v) => !v)}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-foreground">
                  Apenas mulheres
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Só passageiras com gênero feminino podem entrar
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  womenOnly ? "bg-primary" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 size-5 rounded-full bg-white transition-transform ${
                    womenOnly ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>
          </section>
        ) : null}

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
