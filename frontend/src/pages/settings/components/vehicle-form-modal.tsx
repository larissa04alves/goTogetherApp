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

import type { Vehicle } from "../types";

type VehicleFormModalProps = {
  open: boolean;
  initialVehicle: Vehicle | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (vehicle: Vehicle) => void;
};

const empty: Vehicle = { model: "", color: "", plate: "" };

export function VehicleFormModal({
  open,
  initialVehicle,
  onOpenChange,
  onSubmit,
}: VehicleFormModalProps) {
  const isEditing = initialVehicle !== null;
  const [values, setValues] = useState<Vehicle>(initialVehicle ?? empty);

  useEffect(() => {
    if (open) setValues(initialVehicle ?? empty);
  }, [open, initialVehicle]);

  function update<K extends keyof Vehicle>(key: K, value: Vehicle[K]) {
    setValues((curr) => ({ ...curr, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      model: values.model.trim(),
      color: values.color.trim(),
      plate: values.plate.trim().toUpperCase(),
    });
  }

  const canSubmit =
    values.model.trim() !== "" &&
    values.color.trim() !== "" &&
    values.plate.trim() !== "";

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
            id="model"
            label="Modelo"
            value={values.model}
            placeholder="Ex.: Honda Fit"
            onChange={(v) => update("model", v)}
          />
          <Field
            id="color"
            label="Cor"
            value={values.color}
            placeholder="Ex.: Prata"
            onChange={(v) => update("color", v)}
          />
          <Field
            id="plate"
            label="Placa"
            value={values.plate}
            placeholder="ABC-1D23"
            autoCapitalize="characters"
            onChange={(v) => update("plate", v.toUpperCase())}
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
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  onChange: (value: string) => void;
};

function Field({
  id,
  label,
  value,
  placeholder,
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
        type="text"
        value={value}
        autoCapitalize={autoCapitalize}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-lg border-border bg-card text-sm text-foreground"
      />
    </div>
  );
}
