import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { RouteFormValues } from "../map";
import type { SavedRoute } from "../types";

type EndpointForm = {
  label: string;
  rua: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
};

type FormState = {
  origin: EndpointForm;
  destination: EndpointForm;
  departureTime: string;
};

type RouteFormModalProps = {
  open: boolean;
  initialRoute: SavedRoute | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RouteFormValues) => void;
};

const emptyEndpoint: EndpointForm = {
  label: "",
  rua: "",
  numero: "",
  bairro: "",
  cep: "",
  cidade: "Curitiba",
};

// Endereço é guardado como uma string única no backend
// ("rua, número, bairro, cep, cidade"). A cidade é essencial para o geocoding
// não cair em outra cidade do país. Aqui quebramos/recompomos os campos separados.
function parseAddress(address: string): {
  rua: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
} {
  const parts = address.split(",").map((p) => p.trim());
  return {
    rua: parts[0] ?? "",
    numero: parts[1] ?? "",
    bairro: parts[2] ?? "",
    cep: parts[3] ?? "",
    cidade: parts[4] ?? "",
  };
}

function composeAddress(e: EndpointForm): string {
  return [e.rua, e.numero, e.bairro, e.cep, e.cidade]
    .map((p) => p.trim())
    .filter((p) => p !== "")
    .join(", ");
}

function toFormState(route: SavedRoute | null): FormState {
  if (!route) {
    return {
      origin: { ...emptyEndpoint },
      destination: { ...emptyEndpoint },
      departureTime: "",
    };
  }
  return {
    origin: { label: route.origin.label, ...parseAddress(route.origin.address) },
    destination: {
      label: route.destination.label,
      ...parseAddress(route.destination.address),
    },
    departureTime: route.departureTime,
  };
}

function isEndpointComplete(e: EndpointForm): boolean {
  return (
    e.label.trim() !== "" &&
    e.rua.trim() !== "" &&
    e.numero.trim() !== "" &&
    e.bairro.trim() !== "" &&
    e.cep.trim() !== "" &&
    e.cidade.trim() !== ""
  );
}

export function RouteFormModal({
  open,
  initialRoute,
  onOpenChange,
  onSubmit,
}: RouteFormModalProps) {
  const isEditing = initialRoute !== null;
  const [state, setState] = useState<FormState>(() =>
    toFormState(initialRoute),
  );

  useEffect(() => {
    if (open) setState(toFormState(initialRoute));
  }, [open, initialRoute]);

  function updateEndpoint(
    which: "origin" | "destination",
    field: keyof EndpointForm,
    value: string,
  ) {
    setState((curr) => ({
      ...curr,
      [which]: { ...curr[which], [field]: value },
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      originLabel: state.origin.label,
      originAddress: composeAddress(state.origin),
      destinationLabel: state.destination.label,
      destinationAddress: composeAddress(state.destination),
      departureTime: state.departureTime,
    });
  }

  const canSubmit =
    isEndpointComplete(state.origin) &&
    isEndpointComplete(state.destination) &&
    state.departureTime.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90svh] max-w-80! overflow-y-auto rounded-3xl bg-card p-0 ring-0"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <DialogClose
            render={
              <button
                type="button"
                aria-label="Fechar"
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.75} />
          </DialogClose>
          <DialogTitle className="text-[14px] font-bold text-foreground">
            {isEditing ? "Editar rota" : "Nova rota"}
          </DialogTitle>
          <span className="size-8" aria-hidden="true" />
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 px-4 pb-4"
        >
          <EndpointFields
            title="Endereço 1"
            dotClassName="bg-primary"
            endpoint={state.origin}
            labelPlaceholder="Ex.: Trabalho"
            onChange={(field, value) => updateEndpoint("origin", field, value)}
            idPrefix="origin"
          />

          <EndpointFields
            title="Endereço 2"
            dotClassName="bg-slate-400"
            endpoint={state.destination}
            labelPlaceholder="Ex.: Casa"
            onChange={(field, value) =>
              updateEndpoint("destination", field, value)
            }
            idPrefix="destination"
          />

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="departureTime"
              className="text-[11px] font-bold uppercase tracking-wide text-slate-400"
            >
              Horário mais comum de saída
            </Label>
            <Input
              id="departureTime"
              name="departureTime"
              type="time"
              lang="pt-BR"
              step={60}
              value={state.departureTime}
              onChange={(e) =>
                setState((curr) => ({ ...curr, departureTime: e.target.value }))
              }
              className="h-11 rounded-lg border-border bg-card text-sm text-foreground"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 flex-1 rounded-full text-[13px] font-bold"
                />
              }
            >
              Cancelar
            </DialogClose>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-11 flex-1 rounded-full text-[13px] font-bold"
            >
              {isEditing ? "Salvar" : "Criar rota"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type EndpointFieldsProps = {
  title: string;
  dotClassName: string;
  endpoint: EndpointForm;
  labelPlaceholder: string;
  idPrefix: string;
  onChange: (field: keyof EndpointForm, value: string) => void;
};

function EndpointFields({
  title,
  dotClassName,
  endpoint,
  labelPlaceholder,
  idPrefix,
  onChange,
}: EndpointFieldsProps) {
  const showDetails = endpoint.rua.trim() !== "";

  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`size-2.5 rounded-full ${dotClassName}`}
        />
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {title}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}Label`} className="sr-only">
          Nome do {title.toLowerCase()}
        </Label>
        <Input
          id={`${idPrefix}Label`}
          name={`${idPrefix}Label`}
          type="text"
          value={endpoint.label}
          onChange={(e) => onChange("label", e.target.value)}
          placeholder={labelPlaceholder}
          className="h-10 rounded-lg border-border bg-card text-sm font-bold text-foreground"
        />

        <Label htmlFor={`${idPrefix}Rua`} className="sr-only">
          Rua
        </Label>
        <Input
          id={`${idPrefix}Rua`}
          name={`${idPrefix}Rua`}
          type="text"
          value={endpoint.rua}
          onChange={(e) => onChange("rua", e.target.value)}
          placeholder="Nome da rua"
          className="h-10 rounded-lg border-border bg-card text-sm text-foreground"
        />

        {showDetails ? (
          <div className="flex gap-2">
            <div className="flex w-24 shrink-0 flex-col gap-1">
              <Label htmlFor={`${idPrefix}Numero`} className="sr-only">
                Número
              </Label>
              <Input
                id={`${idPrefix}Numero`}
                name={`${idPrefix}Numero`}
                type="text"
                inputMode="numeric"
                value={endpoint.numero}
                onChange={(e) => onChange("numero", e.target.value)}
                placeholder="Nº"
                className="h-10 rounded-lg border-border bg-card text-sm text-foreground"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Label htmlFor={`${idPrefix}Bairro`} className="sr-only">
                Bairro
              </Label>
              <Input
                id={`${idPrefix}Bairro`}
                name={`${idPrefix}Bairro`}
                type="text"
                value={endpoint.bairro}
                onChange={(e) => onChange("bairro", e.target.value)}
                placeholder="Bairro"
                className="h-10 rounded-lg border-border bg-card text-sm text-foreground"
              />
            </div>
          </div>
        ) : null}

        {showDetails ? (
          <div className="flex gap-2">
            <div className="flex w-28 shrink-0 flex-col gap-1">
              <Label htmlFor={`${idPrefix}Cep`} className="sr-only">
                CEP
              </Label>
              <Input
                id={`${idPrefix}Cep`}
                name={`${idPrefix}Cep`}
                type="text"
                inputMode="numeric"
                value={endpoint.cep}
                onChange={(e) => onChange("cep", e.target.value)}
                placeholder="CEP"
                className="h-10 rounded-lg border-border bg-card text-sm text-foreground"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Label htmlFor={`${idPrefix}Cidade`} className="sr-only">
                Cidade
              </Label>
              <Input
                id={`${idPrefix}Cidade`}
                name={`${idPrefix}Cidade`}
                type="text"
                value={endpoint.cidade}
                onChange={(e) => onChange("cidade", e.target.value)}
                placeholder="Cidade"
                className="h-10 rounded-lg border-border bg-card text-sm text-foreground"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
