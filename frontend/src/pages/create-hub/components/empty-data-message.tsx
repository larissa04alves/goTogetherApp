import { Alert01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type EmptyDataMessageProps = {
  message: string;
  ctaLabel: string;
  onClick: () => void;
};

export function EmptyDataMessage({ message, ctaLabel, onClick }: EmptyDataMessageProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-amber-100 text-amber-700">
        <HugeiconsIcon icon={Alert01Icon} size={20} strokeWidth={1.75} />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-sm font-bold text-foreground">{message}</span>
        <span className="text-xs text-primary">{ctaLabel}</span>
      </span>
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.75} />
    </button>
  );
}
