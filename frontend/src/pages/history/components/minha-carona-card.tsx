import {
  BubbleChatIcon,
  Car03Icon,
  SmartPhone01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { CaronaStatus, MinhaCarona } from "@/api/caronas";

const STATUS_LABEL: Record<CaronaStatus, string> = {
  aberta: "Aberta",
  fechada: "Fechada",
  cancelada: "Cancelada",
  concluida: "Concluída",
};

type MinhaCaronaCardProps = {
  carona: MinhaCarona;
  onOpenChat: (id: string) => void;
};

export function MinhaCaronaCard({ carona, onOpenChat }: MinhaCaronaCardProps) {
  const isCarona = carona.tipo === "carro_proprio";
  const ModeIcon = isCarona ? Car03Icon : SmartPhone01Icon;
  const modeLabel = isCarona ? "Carona" : "App de transporte";
  const ocupadas = carona.vagasMax - carona.vagasDisponiveis;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <header className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">
          <HugeiconsIcon icon={ModeIcon} size={12} strokeWidth={2} />
          {modeLabel}
        </span>
        <span className="text-xs font-bold text-muted-foreground">
          {STATUS_LABEL[carona.status]} · {carona.horarioSaida}
        </span>
      </header>

      <p className="text-sm font-bold text-foreground">
        {carona.origemLabel} → {carona.destinoLabel}
      </p>

      <footer className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <HugeiconsIcon icon={UserGroupIcon} size={14} strokeWidth={1.75} />
          {ocupadas}/{carona.vagasMax} ocupadas
        </span>
        {isCarona && carona.valorPorPessoa != null ? (
          <span className="font-bold text-foreground">
            R$ {(carona.valorPorPessoa / 100).toFixed(2).replace(".", ",")}
          </span>
        ) : null}
      </footer>

      {carona.membros.length > 0 ? (
        <div className="flex flex-col gap-1.5 border-t border-border pt-3">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Participantes
          </span>
          <ul className="flex flex-col gap-1">
            {carona.membros.map((m) => (
              <li
                key={m.userId}
                className="flex items-center justify-between text-xs text-foreground"
              >
                <span>{m.user.name}</span>
                <span className="text-[11px] font-bold text-muted-foreground">
                  {m.role === "motorista" ? "Motorista" : "Passageiro"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => onOpenChat(carona.id)}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <HugeiconsIcon icon={BubbleChatIcon} size={16} strokeWidth={1.75} />
        Abrir chat
      </button>
    </article>
  );
}
