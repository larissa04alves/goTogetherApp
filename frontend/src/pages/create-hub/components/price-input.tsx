type PriceInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PriceInput({ value, onChange }: PriceInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
      <span className="text-sm font-bold text-muted-foreground">R$</span>
      <input
        type="number"
        inputMode="decimal"
        step="0.50"
        min="0"
        placeholder="0,00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm font-bold text-foreground outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  );
}
