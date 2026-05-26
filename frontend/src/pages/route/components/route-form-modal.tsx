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

import type { SavedRoute } from "../types";

type RouteFormValues = {
  originLabel: string;
  originAddress: string;
  destinationLabel: string;
  destinationAddress: string;
  departureTime: string;
};

type RouteFormModalProps = {
  open: boolean;
  initialRoute: SavedRoute | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RouteFormValues) => void;
};

const emptyValues: RouteFormValues = {
  originLabel: "",
  originAddress: "",
  destinationLabel: "",
  destinationAddress: "",
  departureTime: "",
};

function toFormValues(route: SavedRoute | null): RouteFormValues {
  if (!route) return emptyValues;
  return {
    originLabel: route.origin.label,
    originAddress: route.origin.address,
    destinationLabel: route.destination.label,
    destinationAddress: route.destination.address,
    departureTime: route.departureTime,
  };
}

export function RouteFormModal({
  open,
  initialRoute,
  onOpenChange,
  onSubmit,
}: RouteFormModalProps) {
  const isEditing = initialRoute !== null;
  const [values, setValues] = useState<RouteFormValues>(() =>
    toFormValues(initialRoute),
  );

  useEffect(() => {
    if (open) setValues(toFormValues(initialRoute));
  }, [open, initialRoute]);

  function update<K extends keyof RouteFormValues>(
    key: K,
    value: RouteFormValues[K],
  ) {
    setValues((curr) => ({ ...curr, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  const canSubmit =
    values.originLabel.trim() !== "" &&
    values.originAddress.trim() !== "" &&
    values.destinationLabel.trim() !== "" &&
    values.destinationAddress.trim() !== "" &&
    values.departureTime.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-90! rounded-3xl bg-card p-0 ring-0"
      >
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
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
            label={values.originLabel}
            address={values.originAddress}
            onLabelChange={(v) => update("originLabel", v)}
            onAddressChange={(v) => update("originAddress", v)}
            labelPlaceholder="Ex.: Trabalho"
            addressPlaceholder="Rua Imaculada Conceição, 155"
            idPrefix="origin"
          />

          <EndpointFields
            title="Endereço 2"
            dotClassName="bg-slate-400"
            label={values.destinationLabel}
            address={values.destinationAddress}
            onLabelChange={(v) => update("destinationLabel", v)}
            onAddressChange={(v) => update("destinationAddress", v)}
            labelPlaceholder="Ex.: Casa"
            addressPlaceholder="Av. Comendador Araújo, 250"
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
              value={values.departureTime}
              onChange={(e) => update("departureTime", e.target.value)}
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
  label: string;
  address: string;
  labelPlaceholder: string;
  addressPlaceholder: string;
  idPrefix: string;
  onLabelChange: (value: string) => void;
  onAddressChange: (value: string) => void;
};

function EndpointFields({
  title,
  dotClassName,
  label,
  address,
  labelPlaceholder,
  addressPlaceholder,
  idPrefix,
  onLabelChange,
  onAddressChange,
}: EndpointFieldsProps) {
  const labelId = `${idPrefix}Label`;
  const addressId = `${idPrefix}Address`;
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
        <Label htmlFor={labelId} className="sr-only">
          Nome do {title.toLowerCase()}
        </Label>
        <Input
          id={labelId}
          name={labelId}
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder={labelPlaceholder}
          className="h-10 rounded-lg border-border bg-card text-sm font-bold text-foreground"
        />

        <Label htmlFor={addressId} className="sr-only">
          Endereço do {title.toLowerCase()}
        </Label>
        <Input
          id={addressId}
          name={addressId}
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder={addressPlaceholder}
          className="h-10 rounded-lg border-border bg-card text-sm text-muted-foreground"
        />
      </div>
    </section>
  );
}
