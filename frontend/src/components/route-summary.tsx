import { ArrowUpFromDotIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { SavedRoute } from "@/pages/route/types";

export function RouteSummary({ route }: { route: SavedRoute }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2 text-sm font-bold text-foreground">
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="size-2 shrink-0 rounded-full bg-primary" />
        <span className="truncate">{route.origin.label}</span>
      </span>
      <span className="rotate-90 text-muted-foreground">
        <HugeiconsIcon icon={ArrowUpFromDotIcon} size={14} strokeWidth={1.75} />
      </span>
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="size-2 shrink-0 rounded-full bg-slate-300" />
        <span className="truncate">{route.destination.label}</span>
      </span>
    </span>
  );
}
