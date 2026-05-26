import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type EmptyRouteCardProps = {
  onAdd: () => void;
};

export function EmptyRouteCard({ onAdd }: EmptyRouteCardProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card/60 px-4 py-6 text-center transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="grid size-10 place-items-center rounded-full bg-emerald-50 text-primary">
        <HugeiconsIcon icon={Add01Icon} size={18} strokeWidth={2.25} />
      </span>
      <span className="text-[13px] font-bold text-foreground">
        Adicione mais uma rota
      </span>
      <span className="text-[11px] text-muted-foreground">
        Salve trajetos frequentes pra encontrar mais rotas rápido
      </span>
    </button>
  );
}
