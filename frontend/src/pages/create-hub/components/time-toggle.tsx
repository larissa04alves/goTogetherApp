import { Checkbox } from "@/components/ui/checkbox";
import type { SavedRoute } from "@/pages/route/types";

type TimeToggleProps = {
  useSaved: boolean;
  onUseSavedChange: (next: boolean) => void;
  customTime: string;
  onCustomTimeChange: (value: string) => void;
  route: SavedRoute | null;
};

export function TimeToggle({
  useSaved,
  onUseSavedChange,
  customTime,
  onCustomTimeChange,
  route,
}: TimeToggleProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <label className="flex items-start gap-3">
        <Checkbox
          checked={useSaved}
          onCheckedChange={(checked) => onUseSavedChange(checked === true)}
          disabled={!route}
          className="mt-0.5"
        />
        <span className="flex flex-col">
          <span className="text-sm font-bold text-foreground">
            Usar horário cadastrado
          </span>
          {route ? (
            <span className="text-xs text-muted-foreground">
              Saída {route.departureTime} · {route.origin.label} →{" "}
              {route.destination.label}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Selecione uma rota primeiro
            </span>
          )}
        </span>
      </label>

      {!useSaved ? (
        <input
          type="time"
          value={customTime}
          onChange={(e) => onCustomTimeChange(e.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ) : null}
    </div>
  );
}
