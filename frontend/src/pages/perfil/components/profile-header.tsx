import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

export function ProfileHeader() {
  return (
    <header className="flex w-full items-center justify-between">
      <h1 className="text-[22px] font-bold leading-tight text-foreground">
        Meu perfil
      </h1>
      <button
        type="button"
        aria-label="Configurações"
        onClick={() => toast.info("Em breve")}
        className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <HugeiconsIcon icon={Settings01Icon} size={20} strokeWidth={1.75} />
      </button>
    </header>
  );
}
