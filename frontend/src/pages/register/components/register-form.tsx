import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Call02Icon,
  Mail01Icon,
  SquareLock01Icon,
  UserIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { maskBrPhone } from "@/lib/format-phone";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
  phoneValidator,
} from "@/lib/validators";

import type { Gender, RegisterStep1Data } from "../types";

const genderOptions: { value: Gender; label: string }[] = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
  { value: "outro", label: "Outro" },
  { value: "prefiro nao dizer", label: "Prefiro não dizer" },
];

const registerSchema = z.object({
  name: nameValidator,
  gender: z.enum(["feminino", "masculino", "outro", "prefiro nao dizer"], {
    error: "Selecione uma opção",
  }),
  email: emailValidator,
  phone: phoneValidator,
  password: passwordValidator,
  emergencyContactName: nameValidator,
  emergencyContactPhone: phoneValidator,
});

type RegisterFormProps = {
  defaultValues?: RegisterStep1Data;
  onContinue: (data: RegisterStep1Data) => void;
};

export function RegisterForm({ defaultValues, onContinue }: RegisterFormProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: defaultValues ?? {
      name: "",
      gender: "" as Gender,
      email: "",
      phone: "",
      password: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
    validators: { onSubmit: registerSchema },
    onSubmit: ({ value }) => {
      onContinue(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/login")}
          aria-label="Voltar"
          className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={1.75} />
        </button>
        <span className="text-[12px] font-bold uppercase tracking-wide text-slate-400">
          Passo 1 de 2
        </span>
      </div>

      <ProgressBar current={1} total={2} />

      <header className="flex flex-col gap-1">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-foreground">
          Crie sua conta
        </h1>
        <p className="text-sm text-muted-foreground">
          Informe seus dados para criar uma conta
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <form.Field name="name">
          {(field) => (
            <IconField
              id={field.name}
              label="Nome completo"
              icon={UserIcon}
              type="text"
              autoComplete="name"
              placeholder="Seu nome completo"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(value) => field.handleChange(value)}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>

        <form.Field name="gender">
          {(field) => {
            const hasError = field.state.meta.errors.length > 0;
            return (
              <div className="flex flex-col gap-2 ">
                <Label
                  htmlFor={field.name}
                  className="text-[11px] font-bold uppercase tracking-wide text-slate-400"
                >
                  Gênero
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as Gender)
                  }
                >
                  <SelectTrigger
                    id={field.name}
                    onBlur={field.handleBlur}
                    aria-invalid={hasError}
                    className="py-6 w-full rounded-lg border-border bg-card pl-3 text-sm text-foreground"
                  >
                    <SelectValue placeholder="Selecione…" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasError && (
                  <ul className="flex flex-col gap-1">
                    {field.state.meta.errors.map((error, i) => (
                      <li
                        key={error?.message ?? i}
                        className="text-xs text-destructive"
                      >
                        {error?.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <IconField
              id={field.name}
              label="E-mail"
              icon={Mail01Icon}
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="seu@email.com"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(value) => field.handleChange(value)}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>

        <form.Field name="phone">
          {(field) => (
            <IconField
              id={field.name}
              label="Telefone"
              icon={Call02Icon}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="(41) 99999-9999"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(value) => field.handleChange(maskBrPhone(value))}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <IconField
              id={field.name}
              label="Senha"
              icon={SquareLock01Icon}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(value) => field.handleChange(value)}
              errors={field.state.meta.errors}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <HugeiconsIcon
                    icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                    size={20}
                    strokeWidth={1.5}
                  />
                </button>
              }
            />
          )}
        </form.Field>
      </div>

      <section className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[13px] font-bold text-foreground">
            Contato de emergência
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Acionado apenas em casos críticos
          </p>
        </div>

        <form.Field name="emergencyContactName">
          {(field) => (
            <IconField
              id={field.name}
              label="Nome"
              icon={Call02Icon}
              type="text"
              placeholder="Maria Alves"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(value) => field.handleChange(value)}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Field name="emergencyContactPhone">
          {(field) => (
            <IconField
              id={field.name}
              label="Telefone"
              icon={Call02Icon}
              type="text"
              placeholder="(41) 98888-8888"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(value) => field.handleChange(maskBrPhone(value))}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
      </section>

      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ canSubmit, isSubmitting }) => (
          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit || isSubmitting}
            className="group h-13.5 w-full rounded-full text-[15px] font-bold"
          >
            {isSubmitting ? "Enviando…" : "Continuar"}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="ml-2 transition-transform group-hover:translate-x-0.5"
            />
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Passo ${current} de ${total}`}
      className="h-1 w-full overflow-hidden rounded-full bg-border"
    >
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

type IconFieldProps = {
  id: string;
  label: string;
  icon: IconSvgElement;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "search" | "url";
  value: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  errors: Array<{ message?: string } | undefined>;
  trailing?: ReactNode;
};

function IconField({
  id,
  label,
  icon,
  type,
  placeholder,
  autoComplete,
  inputMode,
  value,
  onBlur,
  onChange,
  errors,
  trailing,
}: IconFieldProps) {
  const hasError = errors.length > 0;
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="text-[11px] font-bold uppercase tracking-wide text-slate-400"
      >
        {label}
      </Label>
      <div className="relative">
        <HugeiconsIcon
          icon={icon}
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onBlur={onBlur}
          onChange={(e) => onChange(e.target.value)}
          className={`h-13.5 rounded-lg border-border bg-card pl-11 text-sm text-foreground ${
            trailing ? "pr-11" : ""
          }`}
          aria-invalid={hasError}
        />
        {trailing}
      </div>
      {hasError && (
        <ul className="flex flex-col gap-1">
          {errors.map((error, i) => (
            <li key={error?.message ?? i} className="text-xs text-destructive">
              {error?.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
