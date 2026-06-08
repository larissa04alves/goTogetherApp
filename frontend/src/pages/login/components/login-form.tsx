import {
  ArrowRight01Icon,
  Mail01Icon,
  SquareLock01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { emailValidator, passwordValidator } from "@/lib/validators";

const loginSchema = z.object({
  email: emailValidator,
  password: passwordValidator,
});

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        { email: value.email, password: value.password },
        {
          onSuccess: () => {
            toast.success("Login realizado com sucesso");
            navigate("/home");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
      noValidate
    >
      <header className="flex flex-col gap-1">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-foreground">
          Entrar
        </h1>
        <p className="text-sm text-muted-foreground">
          Acesse com seu e-mail e senha
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <form.Field name="email">
          {(field) => (
            <div className="flex flex-col gap-2">
              <Label
                htmlFor={field.name}
                className="text-[11px] font-bold uppercase tracking-wide text-slate-400"
              >
                E-mail
              </Label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="seu@email.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-13.5 rounded-lg border-border bg-card pl-11 text-sm text-foreground"
                  aria-invalid={field.state.meta.errors.length > 0}
                />
              </div>
              <FieldErrors errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div className="flex flex-col gap-2">
              <Label
                htmlFor={field.name}
                className="text-[11px] font-bold uppercase tracking-wide text-slate-400"
              >
                Senha
              </Label>
              <div className="relative">
                <HugeiconsIcon
                  icon={SquareLock01Icon}
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-13.5 rounded-lg border-border bg-card px-11 text-sm text-foreground"
                  aria-invalid={field.state.meta.errors.length > 0}
                />
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
              </div>
              <FieldErrors errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

      </div>

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
            {isSubmitting ? "Entrando…" : "Entrar"}
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

      <div className="flex items-center gap-3">
        <Separator className="flex-1 bg-border" />
        <span className="text-[11px] uppercase text-slate-400">ou</span>
        <Separator className="flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="lg"
        onClick={() => navigate("/register")}
        className="w-full text-sm bg-card py-6 rounded-full border border-border hover:bg-card-foreground"
      >
        Criar conta
      </Button>
    </form>
  );
}

function FieldErrors({
  errors,
}: {
  errors: Array<{ message?: string } | undefined>;
}) {
  if (errors.length === 0) return null;
  return (
    <ul className="flex flex-col gap-1">
      {errors.map((error, i) => (
        <li key={error?.message ?? i} className="text-xs text-destructive">
          {error?.message}
        </li>
      ))}
    </ul>
  );
}
