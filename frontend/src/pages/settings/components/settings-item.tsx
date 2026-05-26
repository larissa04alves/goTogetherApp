import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";

type SettingsItemProps = {
  icon: IconSvgElement;
  title: string;
  description?: string;
  onClick: () => void;
};

export function SettingsItem({
  icon,
  title,
  description,
  onClick,
}: SettingsItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-primary">
        <HugeiconsIcon icon={icon} size={18} strokeWidth={1.75} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-[13px] font-bold text-foreground">
          {title}
        </p>
        {description && (
          <p className="truncate text-[11px] text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        strokeWidth={1.75}
        className="text-muted-foreground"
      />
    </button>
  );
}
