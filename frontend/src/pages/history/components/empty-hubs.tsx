import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type EmptyHubsProps = {
  onCreate: () => void;
};

export function EmptyHubs({ onCreate }: EmptyHubsProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
      <p className="text-sm font-bold text-foreground">
        Você ainda não criou nenhuma carona
      </p>
      <p className="text-xs text-muted-foreground">
        Compartilhe sua rota com a galera da PUCPR
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.25} />
        Criar primeira carona
      </button>
    </div>
  );
}
