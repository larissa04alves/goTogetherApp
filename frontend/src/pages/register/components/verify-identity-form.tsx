import {
  ArrowLeft01Icon,
  Camera02Icon,
  DocumentValidationIcon,
  ShieldUserIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { authClient } from "@/api/auth";
import { uploadDocument } from "@/api/documents";
import { Button } from "@/components/ui/button";

import type { RegisterStep1Data } from "../types";

type VerifyIdentityFormProps = {
  basicData: RegisterStep1Data;
  onBack: () => void;
};

export function VerifyIdentityForm({
  basicData,
  onBack,
}: VerifyIdentityFormProps) {
  const navigate = useNavigate();
  const [idDoc, setIdDoc] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idDocInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = idDoc !== null && selfie !== null && !isSubmitting;

  async function handleSubmit() {
    if (idDoc === null || selfie === null || isSubmitting) return;
    const doc = idDoc;
    const selfieDoc = selfie;
    setIsSubmitting(true);
    try {
      await authClient.signUp.email(
        {
          name: basicData.name,
          email: basicData.email,
          password: basicData.password,
          gender: basicData.gender,
          phone: basicData.phone,
          emergencyContactName: basicData.emergencyContactName,
          emergencyContactPhone: basicData.emergencyContactPhone,
        },
        {
          onSuccess: async () => {
            try {
              await uploadDocument(doc);
              await uploadDocument(selfieDoc);
              toast.success("Conta criada. Verificação enviada para análise.");
            } catch {
              toast.warning(
                "Conta criada, mas o envio dos documentos falhou. Tente novamente mais tarde.",
              );
            }
            navigate("/home");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    } catch {
      toast.error("Não foi possível concluir o cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar para passo 1"
          className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={1.75} />
        </button>
        <span className="text-[12px] font-bold uppercase tracking-wide text-primary">
          Passo 2 de 2
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={2}
        aria-valuemin={0}
        aria-valuemax={2}
        aria-label="Passo 2 de 2"
        className="h-1 w-full overflow-hidden rounded-full bg-border"
      >
        <div className="h-full w-full bg-[#2ddda8]" />
      </div>

      <header className="flex flex-col gap-1">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-foreground">
          Verifique sua identidade
        </h1>
        <p className="text-sm text-muted-foreground">
          Pra todo mundo se sentir seguro no app
        </p>
      </header>

      <aside className="flex gap-3 rounded-lg border border-[#2ddda8]/40 bg-[#e0faf1] p-4">
        <HugeiconsIcon
          icon={ShieldUserIcon}
          size={22}
          strokeWidth={1.65}
          aria-hidden="true"
          className="shrink-0 text-primary"
        />
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-bold text-foreground">
            Por que verificamos?
          </p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Confirmamos que você é uma pessoa real pra manter a comunidade
            segura. Seus dados ficam privados.
          </p>
        </div>
      </aside>

      <section className="flex flex-col gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          1 · Documento com foto
        </p>

        <input
          ref={idDocInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="sr-only"
          onChange={(e) => setIdDoc(e.target.files?.[0] ?? null)}
        />

        {idDoc ? (
          <div className="flex items-center gap-3 rounded-lg border-2 border-[#2ddda8] bg-card p-3">
            <div className="grid size-12 shrink-0 place-items-center rounded-md bg-[#e0faf1]">
              <HugeiconsIcon
                icon={DocumentValidationIcon}
                size={24}
                strokeWidth={1.8}
                className="text-primary"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-sm font-bold text-foreground">
                {idDoc.name}
              </p>
              <span className="flex items-center gap-1 text-[11px] text-primary">
                <span className="grid size-3.5 place-items-center rounded-full bg-[#2ddda8]">
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    size={10}
                    strokeWidth={3}
                    className="text-foreground"
                  />
                </span>
                Enviado com sucesso
              </span>
            </div>
            <button
              type="button"
              onClick={() => idDocInputRef.current?.click()}
              className="shrink-0 text-xs font-bold text-primary hover:underline"
            >
              Trocar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => idDocInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-300 bg-card p-6 text-center transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="grid size-12 place-items-center rounded-md bg-muted">
              <HugeiconsIcon
                icon={DocumentValidationIcon}
                size={24}
                strokeWidth={1.8}
                className="text-muted-foreground"
              />
            </div>
            <span className="text-[13px] font-bold text-foreground">
              Enviar documento
            </span>
            <span className="text-[11px] text-muted-foreground">
              RG, CNH ou passaporte
            </span>
          </button>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          2 · Selfie com o documento
        </p>

        <input
          ref={selfieInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="sr-only"
          onChange={(e) => setSelfie(e.target.files?.[0] ?? null)}
        />

        <button
          type="button"
          onClick={() => selfieInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 rounded-lg border bg-card p-8 text-center transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            selfie ? "border-2 border-[#2ddda8]" : "border-slate-300"
          }`}
        >
          <div className="grid size-12 place-items-center rounded-md bg-muted">
            <HugeiconsIcon
              icon={Camera02Icon}
              size={28}
              strokeWidth={1.8}
              className="text-muted-foreground"
            />
          </div>
          <span className="text-[13px] font-bold text-foreground">
            {selfie ? selfie.name : "Tirar selfie"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Segure o documento ao lado do rosto
          </span>
        </button>
      </section>

      <Button
        type="button"
        size="lg"
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="h-13.5 w-full rounded-full text-[15px] font-bold"
      >
        {isSubmitting ? "Enviando…" : "Finalizar verificação"}
      </Button>
    </div>
  );
}
