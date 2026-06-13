import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import type { Vehicle, VehicleInput } from "@/api/vehicles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VehicleFormModalProps = {
  open: boolean;
  initialVehicle: Vehicle | null;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (vehicle: VehicleInput) => void;
};

type FormState = {
  marca: string;
  modelo: string;
  placa: string;
  cor: string;
  capacidade: string;
};

const empty: FormState = {
  marca: "",
  modelo: "",
  placa: "",
  cor: "",
  capacidade: "",
};

function toFormState(vehicle: Vehicle | null): FormState {
  if (vehicle === null) return empty;
  return {
    marca: vehicle.marca,
    modelo: vehicle.modelo,
    placa: vehicle.placa,
    cor: vehicle.cor,
    capacidade: String(vehicle.capacidade),
  };
}

export function VehicleFormModal({
  open,
  initialVehicle,
  submitting = false,
  onOpenChange,
  onSubmit,
}: VehicleFormModalProps) {
  const isEditing = initialVehicle !== null;
  const [values, setValues] = useState<FormState>(() =>
    toFormState(initialVehicle),
  );

  useEffect(() => {
    if (open) setValues(toFormState(initialVehicle));
  }, [open, initialVehicle]);

  function update<K extends keyof FormState>(key: K, value: string) {
    setValues((curr) => ({ ...curr, [key]: value }));
  }

  const capacidade = Number.parseInt(values.capacidade, 10);
  const capacidadeValid =
    Number.isInteger(capacidade) && capacidade >= 1 && capacidade <= 7;

  const canSubmit =
    values.marca.trim() !== "" &&
    values.modelo.trim() !== "" &&
    values.placa.trim() !== "" &&
    values.cor.trim() !== "" &&
    capacidadeValid &&
    !submitting;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      marca: values.marca.trim(),
      modelo: values.modelo.trim(),
      placa: values.placa.trim().toUpperCase(),
      cor: values.cor.trim(),
      capacidade,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-80! rounded-3xl bg-card p-0 ring-0"
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
            {isEditing ? "Editar veículo" : "Cadastrar veículo"}
          </DialogTitle>
          <span className="size-8" aria-hidden="true" />
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 px-4 pb-4"
        >
          <Field
            id="marca"
            label="Marca"
            value={values.marca}
            placeholder="Ex.: Honda"
            onChange={(v) => update("marca", v)}
          />
          <Field
            id="modelo"
            label="Modelo"
            value={values.modelo}
            placeholder="Ex.: Fit"
            onChange={(v) => update("modelo", v)}
          />
          <Field
            id="cor"
            label="Cor"
            value={values.cor}
            placeholder="Ex.: Prata"
            onChange={(v) => update("cor", v)}
          />
          <Field
            id="placa"
            label="Placa"
            value={values.placa}
            placeholder="ABC-1D23"
            autoCapitalize="characters"
            onChange={(v) => update("placa", v.toUpperCase())}
          />
          <Field
            id="capacidade"
            label="Lugares"
            type="number"
            inputMode="numeric"
            value={values.capacidade}
            placeholder="Ex.: 4"
            onChange={(v) => update("capacidade", v)}
          />

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
              {isEditing ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  inputMode?:
    | "none"
    | "text"
    | "numeric"
    | "decimal"
    | "tel"
    | "search"
    | "email"
    | "url";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  onChange: (value: string) => void;
};

function Field({
  id,
  label,
  value,
  placeholder,
  type = "text",
  inputMode,
  autoCapitalize,
  onChange,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="text-[11px] font-bold uppercase tracking-wide text-slate-400"
      >
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        value={value}
        autoCapitalize={autoCapitalize}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-lg border-border bg-card text-sm text-foreground"
      />
    </div>
  );
}
