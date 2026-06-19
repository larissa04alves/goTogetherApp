import {
  BubbleChatIcon,
  Cancel01Icon,
  Car03Icon,
  CheckmarkBadge01Icon,
  Logout03Icon,
  SmartPhone01Icon,
  StarIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { CaronaStatus, MeuHub } from "@/api/hubs";
import type { PendingReview } from "@/api/reviews";

const STATUS_LABEL: Record<CaronaStatus, string> = {
  aberta: "Aberta",
  fechada: "Fechada",
  cancelada: "Cancelada",
  concluida: "Concluída",
};

type MyRideCardProps = {
  hub: MeuHub;
  currentUserId: string | undefined;
  pendentes: PendingReview[];
  onOpenChat: (id: string) => void;
  onKick: (hubId: string, membroId: string) => void;
  onLeave: (hubId: string) => void;
  onComplete: (hubId: string) => void;
  onCancel: (hubId: string) => void;
  onRate: (caronaId: string, avaliado: { id: string; name: string }) => void;
  onOpenProfile: (userId: string) => void;
};

export function MyRideCard({
  hub,
  currentUserId,
  pendentes,
  onOpenChat,
  onKick,
  onLeave,
  onComplete,
  onCancel,
  onRate,
  onOpenProfile,
}: MyRideCardProps) {
  const isCarona = hub.tipo === "carro_proprio";
  const ModeIcon = isCarona ? Car03Icon : SmartPhone01Icon;
  const modeLabel = isCarona ? "Carona" : "App de transporte";
  const ocupadas = hub.vagasMax - hub.vagasDisponiveis;
  const isDono = hub.papel === "motorista";
  const isAberta = hub.status === "aberta";

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <header className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">
          <HugeiconsIcon icon={ModeIcon} size={12} strokeWidth={2} />
          {modeLabel}
        </span>
        <span className="text-xs font-bold text-muted-foreground">
          {STATUS_LABEL[hub.status]} · {hub.horarioSaida}
        </span>
      </header>

      <p className="text-sm font-bold text-foreground">
        {hub.rota.origemNome} → {hub.rota.destinoNome}
      </p>

      <footer className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <HugeiconsIcon icon={UserGroupIcon} size={14} strokeWidth={1.75} />
          {ocupadas}/{hub.vagasMax} ocupadas
        </span>
        {isCarona && hub.valorPorPessoa != null ? (
          <span className="font-bold text-foreground">
            R$ {(hub.valorPorPessoa / 100).toFixed(2).replace(".", ",")}
          </span>
        ) : null}
      </footer>

      {hub.membros.length > 0 ? (
        <div className="flex flex-col gap-1.5 border-t border-border pt-3">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Participantes
          </span>
          <ul className="flex flex-col gap-1">
            {hub.membros.map((m) => {
              const podeExpulsar =
                isDono &&
                isAberta &&
                m.role !== "motorista" &&
                m.userId !== currentUserId;
              return (
                <li
                  key={m.userId}
                  className="flex items-center justify-between gap-2 text-xs text-foreground"
                >
                  <button
                    type="button"
                    onClick={() => onOpenProfile(m.userId)}
                    className="truncate text-left hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {m.user.name}
                  </button>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      {m.role === "motorista" ? "Motorista" : "Passageiro"}
                    </span>
                    {podeExpulsar ? (
                      <button
                        type="button"
                        aria-label={`Expulsar ${m.user.name}`}
                        onClick={() => onKick(hub.id, m.userId)}
                        className="grid size-6 place-items-center rounded-full text-rose-500 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          size={14}
                          strokeWidth={2}
                        />
                      </button>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="mt-1 flex flex-wrap gap-2">
        <CardButton
          icon={BubbleChatIcon}
          label="Chat"
          onClick={() => onOpenChat(hub.id)}
        />

        {isAberta && isDono ? (
          <>
            <CardButton
              icon={CheckmarkBadge01Icon}
              label="Concluir"
              onClick={() => onComplete(hub.id)}
            />
            <CardButton
              icon={Cancel01Icon}
              label="Cancelar"
              destructive
              onClick={() => onCancel(hub.id)}
            />
          </>
        ) : null}

        {isAberta && !isDono ? (
          <CardButton
            icon={Logout03Icon}
            label="Cancelar"
            destructive
            onClick={() => onLeave(hub.id)}
          />
        ) : null}
      </div>

      {hub.status === "concluida" && pendentes.length > 0 ? (
        <div className="flex flex-col gap-2 border-t border-border pt-3">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Avaliações pendentes
          </span>
          {pendentes.map((p) => (
            <CardButton
              key={p.usuario.id}
              icon={StarIcon}
              label={`Avaliar ${p.usuario.name}`}
              onClick={() =>
                onRate(hub.id, { id: p.usuario.id, name: p.usuario.name })
              }
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

function CardButton({
  icon,
  label,
  onClick,
  destructive = false,
}: {
  icon: typeof BubbleChatIcon;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        destructive
          ? "border-rose-200 bg-card text-rose-600 hover:bg-rose-50"
          : "border-border bg-card text-foreground hover:bg-muted"
      }`}
    >
      <HugeiconsIcon icon={icon} size={16} strokeWidth={1.75} />
      {label}
    </button>
  );
}
