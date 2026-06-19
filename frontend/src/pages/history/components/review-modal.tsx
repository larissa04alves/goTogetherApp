import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { createAvaliacao } from "@/api/reviews";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export type ReviewTarget = {
  caronaId: string;
  avaliado: { id: string; name: string };
};

type ReviewModalProps = {
  target: ReviewTarget | null;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
};

export function ReviewModal({
  target,
  onOpenChange,
  onSubmitted,
}: ReviewModalProps) {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (target) {
      setNota(5);
      setComentario("");
    }
  }, [target]);

  async function submit() {
    if (!target || pending) return;
    setPending(true);
    try {
      const texto = comentario.trim();
      await createAvaliacao({
        carona_id: target.caronaId,
        avaliado_id: target.avaliado.id,
        nota,
        comentario: texto === "" ? undefined : texto,
      });
      toast.success("Avaliação enviada");
      onSubmitted();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao avaliar");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-80! rounded-3xl bg-card p-0 ring-0"
      >
        <div className="flex flex-col gap-3 px-5 pb-5 pt-6">
          <DialogTitle className="text-[15px] font-bold text-foreground">
            Avaliar {target?.avaliado.name ?? ""}
          </DialogTitle>
          <DialogDescription className="text-[13px] text-muted-foreground">
            Como foi a experiência nesta carona?
          </DialogDescription>

          <div className="flex justify-center gap-1.5 py-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
                onClick={() => setNota(n)}
                className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <HugeiconsIcon
                  icon={StarIcon}
                  size={30}
                  strokeWidth={2}
                  className={
                    n <= nota
                      ? "text-amber-500"
                      : "text-slate-300"
                  }
                />
              </button>
            ))}
          </div>

          <Textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comentário (opcional)"
            rows={3}
            className="resize-none rounded-xl border-border bg-card text-sm"
          />

          <Button
            type="button"
            disabled={pending}
            onClick={submit}
            className="h-11 rounded-full text-[13px] font-bold"
          >
            {pending ? "Enviando…" : "Enviar avaliação"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
