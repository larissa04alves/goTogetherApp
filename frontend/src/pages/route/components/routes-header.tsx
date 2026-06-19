import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type RoutesHeaderProps = {
  onAdd: () => void;
};

export function RoutesHeader({ onAdd }: RoutesHeaderProps) {
  return (
    <header className="flex w-full flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[22px] font-bold leading-tight text-foreground">
          Minhas rotas
        </h1>
        <button
          type="button"
          aria-label="Adicionar rota"
          onClick={onAdd}
          className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-primary transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <HugeiconsIcon icon={Add01Icon} size={18} strokeWidth={2.25} />
        </button>
      </div>
      <p className="text-[12px] text-muted-foreground">
        Suas rotas salvas pra agilizar a busca por hubs
      </p>
    </header>
  );
}
