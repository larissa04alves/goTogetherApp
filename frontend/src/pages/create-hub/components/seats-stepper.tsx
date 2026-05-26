import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const MIN = 1;
const MAX = 6;

type SeatsStepperProps = {
  value: number;
  onChange: (value: number) => void;
};

export function SeatsStepper({ value, onChange }: SeatsStepperProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-card p-2">
      <StepButton
        ariaLabel="Diminuir vagas"
        disabled={value <= MIN}
        onClick={() => onChange(Math.max(MIN, value - 1))}
        icon={MinusSignIcon}
      />
      <span className="text-sm font-bold text-foreground">
        {value} {value === 1 ? "passageiro" : "passageiros"}
      </span>
      <StepButton
        ariaLabel="Aumentar vagas"
        disabled={value >= MAX}
        onClick={() => onChange(Math.min(MAX, value + 1))}
        icon={PlusSignIcon}
      />
    </div>
  );
}

type StepButtonProps = {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  icon: typeof MinusSignIcon;
};

function StepButton({ ariaLabel, disabled, onClick, icon }: StepButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-xl bg-muted text-foreground transition-colors hover:bg-muted/70 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <HugeiconsIcon icon={icon} size={16} strokeWidth={2} />
    </button>
  );
}
