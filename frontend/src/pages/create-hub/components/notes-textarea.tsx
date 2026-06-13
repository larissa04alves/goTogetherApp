import { Textarea } from "@/components/ui/textarea";

const MAX_LEN = 200;

type NotesTextareaProps = {
  value: string;
  onChange: (value: string) => void;
};

export function NotesTextarea({ value, onChange }: NotesTextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_LEN))}
        placeholder="Preferência de app, ponto de encontro, etc"
        rows={3}
        className="rounded-2xl border-border bg-card text-sm"
      />
      <span className="self-end text-[11px] text-muted-foreground">
        {value.length}/{MAX_LEN}
      </span>
    </div>
  );
}
