# Hubs: criar carona / app de transporte — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir publicar caronas (próprio carro) ou transporte por app (99/Uber) a partir do botão + da bottom nav, com listagem em nova aba "Caronas".

**Architecture:** Frontend-only. Duas novas rotas (`/hubs/novo`, `/caronas`), uma rota renomeada (`/home` vira tab "Hubs"), um Sheet de seleção de modo, e um helper `localStorage` para partilhar estado entre páginas sem Context — cada página mantém `useState` local hidratado de `localStorage`.

**Tech Stack:** React Router 7 SPA, TypeScript strict, Tailwind 4, shadcn/ui (Sheet, Checkbox, Textarea novos), HugeIcons, Sonner para toasts.

**Spec:** [`docs/superpowers/specs/2026-05-26-hubs-criar-carona-design.md`](../specs/2026-05-26-hubs-criar-carona-design.md)

---

## Mapa de arquivos

**Novos:**
- `frontend/src/lib/storage.ts` — helpers `loadJSON` / `saveJSON`
- `frontend/src/components/create-hub-sheet.tsx` — Sheet com 2 cards (Carona / App)
- `frontend/src/pages/caronas/index.tsx` — lista "Minhas caronas"
- `frontend/src/pages/caronas/types.ts` — `Hub`, `CaronaHub`, `AppTransporteHub`
- `frontend/src/pages/caronas/components/hub-card.tsx`
- `frontend/src/pages/caronas/components/empty-hubs.tsx`
- `frontend/src/pages/hubs-novo/index.tsx` — form condicional por modo
- `frontend/src/pages/hubs-novo/components/route-picker.tsx`
- `frontend/src/pages/hubs-novo/components/time-toggle.tsx`
- `frontend/src/pages/hubs-novo/components/seats-stepper.tsx`
- `frontend/src/pages/hubs-novo/components/price-input.tsx`
- `frontend/src/pages/hubs-novo/components/vehicle-card.tsx`
- `frontend/src/pages/hubs-novo/components/notes-textarea.tsx`
- `frontend/src/pages/hubs-novo/components/prereq-cta.tsx`
- `frontend/src/components/ui/sheet.tsx` (via shadcn add)
- `frontend/src/components/ui/checkbox.tsx` (via shadcn add)
- `frontend/src/components/ui/textarea.tsx` (via shadcn add)

**Modificados:**
- `frontend/src/routes.ts` — adiciona `/caronas` e `/hubs/novo`
- `frontend/src/components/bottom-nav.tsx` — 5 itens, rebrand Hubs, integra Sheet
- `frontend/src/pages/rotas/index.tsx` — hidrata `useState` de `localStorage`
- `frontend/src/pages/configuracoes/index.tsx` — hidrata `useState` de `localStorage`
- `frontend/src/pages/home/index.tsx` — `active="hubs"` no BottomNav

---

## Task 1: Helper de localStorage

**Files:**
- Create: `frontend/src/lib/storage.ts`

- [ ] **Step 1: Criar helpers `loadJSON` / `saveJSON`**

```ts
// frontend/src/lib/storage.ts
export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage indisponível (quota, modo privado); ignora
  }
}
```

- [ ] **Step 2: Verificar tipos**

Run: `npm run check-types`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add frontend/src/lib/storage.ts
git commit -m "feat: helpers loadJSON e saveJSON para localStorage"
```

---

## Task 2: Persistir rotas e veículo em localStorage

**Files:**
- Modify: `frontend/src/pages/rotas/index.tsx`
- Modify: `frontend/src/pages/configuracoes/index.tsx`

- [ ] **Step 1: Atualizar `pages/rotas/index.tsx` para hidratar e gravar**

Substituir a inicialização `useState<SavedRoute[]>(mockSavedRoutes)` por:

```tsx
import { useEffect, useState } from "react";
import { loadJSON, saveJSON } from "@/lib/storage";
// ... outros imports já existentes

const STORAGE_KEY = "routes";

export default function RotasPage() {
  const [routes, setRoutes] = useState<SavedRoute[]>(() =>
    loadJSON<SavedRoute[]>(STORAGE_KEY, mockSavedRoutes),
  );
  // ... resto sem mudança

  useEffect(() => {
    saveJSON(STORAGE_KEY, routes);
  }, [routes]);

  // ... resto da função sem mudança
}
```

- [ ] **Step 2: Atualizar `pages/configuracoes/index.tsx` igual**

```tsx
import { useEffect, useState } from "react";
import { loadJSON, saveJSON } from "@/lib/storage";
// ... outros imports já existentes

const STORAGE_KEY = "vehicle";

export default function ConfiguracoesPage() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(() =>
    loadJSON<Vehicle | null>(STORAGE_KEY, null),
  );
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    saveJSON(STORAGE_KEY, vehicle);
  }, [vehicle]);

  // ... resto sem mudança
}
```

- [ ] **Step 3: Verificar tipos**

Run: `npm run check-types`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/rotas/index.tsx frontend/src/pages/configuracoes/index.tsx
git commit -m "feat: persistir rotas e veículo em localStorage"
```

---

## Task 3: Adicionar componentes shadcn faltantes

**Files:**
- Create: `frontend/src/components/ui/sheet.tsx`
- Create: `frontend/src/components/ui/checkbox.tsx`
- Create: `frontend/src/components/ui/textarea.tsx`

- [ ] **Step 1: Adicionar via shadcn CLI**

Run (no diretório `frontend/`):
```bash
cd frontend && npx shadcn@latest add sheet checkbox textarea
```

Expected: arquivos criados em `frontend/src/components/ui/`. Aceitar todos os defaults.

- [ ] **Step 2: Verificar tipos**

Run (raiz): `npm run check-types`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/ frontend/package.json frontend/package-lock.json
git commit -m "chore: adicionar sheet, checkbox e textarea do shadcn"
```

---

## Task 4: Tipos do Hub

**Files:**
- Create: `frontend/src/pages/caronas/types.ts`

- [ ] **Step 1: Criar tipos**

```ts
// frontend/src/pages/caronas/types.ts
import type { Vehicle } from "@/pages/configuracoes/types";

export type HubMode = "carona" | "app";

export type HubBase = {
  id: string;
  routeId: string;
  departureTime: string; // "HH:mm"
  seats: number;
  createdAt: string; // ISO
};

export type CaronaHub = HubBase & {
  mode: "carona";
  priceBRL: number;
  vehicle: Vehicle;
};

export type AppTransporteHub = HubBase & {
  mode: "app";
  notes?: string;
};

export type Hub = CaronaHub | AppTransporteHub;
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/caronas/types.ts
git commit -m "feat: tipos Hub (CaronaHub e AppTransporteHub)"
```

---

## Task 5: BottomNav com 5 itens e Sheet integrado

**Files:**
- Create: `frontend/src/components/create-hub-sheet.tsx`
- Modify: `frontend/src/components/bottom-nav.tsx`
- Modify: `frontend/src/pages/home/index.tsx`

- [ ] **Step 1: Criar `create-hub-sheet.tsx`**

```tsx
// frontend/src/components/create-hub-sheet.tsx
import { Car03Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type CreateHubSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateHubSheet({ open, onOpenChange }: CreateHubSheetProps) {
  const navigate = useNavigate();

  function handlePick(modo: "carona" | "app") {
    onOpenChange(false);
    navigate(`/hubs/novo?modo=${modo}`);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Criar nova carona</SheetTitle>
          <SheetDescription>Escolha como você vai oferecer</SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
          <button
            type="button"
            onClick={() => handlePick("carona")}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-primary/15 text-primary">
              <HugeiconsIcon icon={Car03Icon} size={22} strokeWidth={1.75} />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Carona</span>
              <span className="text-xs text-muted-foreground">
                Use seu carro e defina o valor por passageiro
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => handlePick("app")}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-primary/15 text-primary">
              <HugeiconsIcon icon={SmartPhone01Icon} size={22} strokeWidth={1.75} />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-bold text-foreground">
                App de transporte
              </span>
              <span className="text-xs text-muted-foreground">
                99, Uber e similares — sem valor nem veículo
              </span>
            </span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 2: Reescrever `bottom-nav.tsx` com 5 itens + Sheet**

```tsx
// frontend/src/components/bottom-nav.tsx
import {
  Add01Icon,
  Car03Icon,
  Home09Icon,
  Route01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { CreateHubSheet } from "./create-hub-sheet";

type NavKey = "hubs" | "routes" | "rides" | "profile";

type BottomNavProps = {
  active: NavKey;
};

type NavItem = {
  key: NavKey;
  label: string;
  icon: IconSvgElement;
  href: string;
};

const hubsItem: NavItem = {
  key: "hubs",
  label: "Hubs",
  icon: Home09Icon,
  href: "/home",
};
const routesItem: NavItem = {
  key: "routes",
  label: "Rotas",
  icon: Route01Icon,
  href: "/rotas",
};
const ridesItem: NavItem = {
  key: "rides",
  label: "Caronas",
  icon: Car03Icon,
  href: "/caronas",
};
const profileItem: NavItem = {
  key: "profile",
  label: "Perfil",
  icon: UserIcon,
  href: "/perfil",
};

export function BottomNav({ active }: BottomNavProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Navegação principal"
        className="sticky bottom-0 left-0 right-0 mt-auto border-t border-border bg-card"
      >
        <div className="relative mx-auto flex h-16 max-w-100 items-center justify-around gap-1 px-2 pb-[env(safe-area-inset-bottom)]">
          <NavButton item={hubsItem} active={active === hubsItem.key} />
          <NavButton item={routesItem} active={active === routesItem.key} />

          <button
            type="button"
            aria-label="Criar nova carona"
            onClick={() => setSheetOpen(true)}
            className="grid size-13 -translate-y-4 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HugeiconsIcon icon={Add01Icon} size={22} strokeWidth={2.25} />
          </button>

          <NavButton item={ridesItem} active={active === ridesItem.key} />
          <NavButton item={profileItem} active={active === profileItem.key} />
        </div>
      </nav>

      <CreateHubSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}

function NavButton({ item, active }: { item: NavItem; active: boolean }) {
  const navigate = useNavigate();

  function handleClick() {
    if (active) return;
    navigate(item.href);
  }

  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={handleClick}
      className={`flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-bold transition-colors focus-visible:outline-none ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <HugeiconsIcon icon={item.icon} size={20} strokeWidth={1.75} />
      <span>{item.label}</span>
    </button>
  );
}
```

- [ ] **Step 3: Atualizar `pages/home/index.tsx` para `active="hubs"`**

Trocar `<BottomNav active="home" />` por `<BottomNav active="hubs" />`.

- [ ] **Step 4: Verificar tipos**

Run: `npm run check-types`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/bottom-nav.tsx frontend/src/components/create-hub-sheet.tsx frontend/src/pages/home/index.tsx
git commit -m "feat: bottom nav com Hubs/Caronas e sheet de criar"
```

---

## Task 6: Página /caronas — lista vazia + tipos prontos

**Files:**
- Create: `frontend/src/pages/caronas/components/empty-hubs.tsx`
- Create: `frontend/src/pages/caronas/components/hub-card.tsx`
- Create: `frontend/src/pages/caronas/index.tsx`
- Modify: `frontend/src/routes.ts`

- [ ] **Step 1: Criar `empty-hubs.tsx`**

```tsx
// frontend/src/pages/caronas/components/empty-hubs.tsx
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type EmptyHubsProps = {
  onCreate: () => void;
};

export function EmptyHubs({ onCreate }: EmptyHubsProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
      <p className="text-sm font-bold text-foreground">
        Você ainda não criou nenhuma carona
      </p>
      <p className="text-xs text-muted-foreground">
        Compartilhe sua rota com a galera da PUCPR
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.25} />
        Criar primeira carona
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Criar `hub-card.tsx`**

```tsx
// frontend/src/pages/caronas/components/hub-card.tsx
import { Car03Icon, SmartPhone01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { SavedRoute } from "@/pages/rotas/types";

import type { Hub } from "../types";

type HubCardProps = {
  hub: Hub;
  route: SavedRoute | undefined;
};

export function HubCard({ hub, route }: HubCardProps) {
  const isCarona = hub.mode === "carona";
  const ModeIcon = isCarona ? Car03Icon : SmartPhone01Icon;
  const modeLabel = isCarona ? "Carona" : "App de transporte";

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <header className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">
          <HugeiconsIcon icon={ModeIcon} size={12} strokeWidth={2} />
          {modeLabel}
        </span>
        <span className="text-xs font-bold text-muted-foreground">
          {hub.departureTime}
        </span>
      </header>

      <p className="text-sm font-bold text-foreground">
        {route
          ? `${route.origin.label} → ${route.destination.label}`
          : "Rota removida"}
      </p>

      <footer className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <HugeiconsIcon icon={UserGroupIcon} size={14} strokeWidth={1.75} />
          {hub.seats} {hub.seats === 1 ? "vaga" : "vagas"}
        </span>
        {isCarona ? (
          <span className="font-bold text-foreground">
            R$ {hub.priceBRL.toFixed(2).replace(".", ",")}
          </span>
        ) : hub.notes ? (
          <span className="line-clamp-1 max-w-[60%] text-right">{hub.notes}</span>
        ) : null}
      </footer>

      {isCarona ? (
        <p className="text-[11px] text-muted-foreground">
          {hub.vehicle.model} · {hub.vehicle.plate}
        </p>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 3: Criar `pages/caronas/index.tsx`**

```tsx
// frontend/src/pages/caronas/index.tsx
import { useEffect, useState } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { loadJSON, saveJSON } from "@/lib/storage";
import type { SavedRoute } from "@/pages/rotas/types";

import { EmptyHubs } from "./components/empty-hubs";
import { HubCard } from "./components/hub-card";
import type { Hub } from "./types";

const HUBS_KEY = "hubs";
const ROUTES_KEY = "routes";

export default function CaronasPage() {
  const [hubs, setHubs] = useState<Hub[]>(() => loadJSON<Hub[]>(HUBS_KEY, []));
  const [routes] = useState<SavedRoute[]>(() =>
    loadJSON<SavedRoute[]>(ROUTES_KEY, []),
  );

  useEffect(() => {
    saveJSON(HUBS_KEY, hubs);
  }, [hubs]);

  const sorted = [...hubs].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-4 px-5 pb-24 pt-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold leading-tight text-foreground">
            Minhas caronas
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            {hubs.length} {hubs.length === 1 ? "criada" : "criadas"}
          </p>
        </header>

        {sorted.length === 0 ? (
          <EmptyHubs onCreate={() => setHubs(hubs)} />
        ) : (
          <section className="flex flex-col gap-3">
            {sorted.map((hub) => (
              <HubCard
                key={hub.id}
                hub={hub}
                route={routes.find((r) => r.id === hub.routeId)}
              />
            ))}
          </section>
        )}
      </div>
      <BottomNav active="rides" />
    </main>
  );
}
```

Nota: `onCreate` em `EmptyHubs` está com no-op intencional porque o Sheet de criação vive dentro do `BottomNav` — o CTA do estado vazio aciona o mesmo fluxo via FAB. Mantemos a prop pra evolução futura (ex.: levantar o sheet) sem complicar agora.

- [ ] **Step 4: Adicionar rota em `routes.ts`**

```ts
// frontend/src/routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/login/index.tsx"),
  route("login", "pages/login/index.tsx", { id: "login" }),
  route("register", "pages/register/index.tsx"),
  route("home", "pages/home/index.tsx"),
  route("perfil", "pages/perfil/index.tsx"),
  route("rotas", "pages/rotas/index.tsx"),
  route("caronas", "pages/caronas/index.tsx"),
  route("configuracoes", "pages/configuracoes/index.tsx"),
] satisfies RouteConfig;
```

- [ ] **Step 5: Verificar tipos**

Run: `npm run check-types`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/caronas/ frontend/src/routes.ts
git commit -m "feat: página /caronas com lista de hubs criados"
```

---

## Task 7: Sub-componentes do form de criação

**Files:**
- Create: `frontend/src/pages/hubs-novo/components/seats-stepper.tsx`
- Create: `frontend/src/pages/hubs-novo/components/price-input.tsx`
- Create: `frontend/src/pages/hubs-novo/components/notes-textarea.tsx`
- Create: `frontend/src/pages/hubs-novo/components/time-toggle.tsx`
- Create: `frontend/src/pages/hubs-novo/components/vehicle-card.tsx`
- Create: `frontend/src/pages/hubs-novo/components/prereq-cta.tsx`
- Create: `frontend/src/pages/hubs-novo/components/route-picker.tsx`

- [ ] **Step 1: `seats-stepper.tsx`**

```tsx
// frontend/src/pages/hubs-novo/components/seats-stepper.tsx
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const MIN = 1;
const MAX = 6;

type SeatsStepperProps = {
  value: number;
  onChange: (value: number) => void;
};

export function SeatsStepper({ value, onChange }: SeatsStepperProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-card p-2">
      <StepButton
        ariaLabel="Diminuir vagas"
        disabled={value <= MIN}
        onClick={() => onChange(Math.max(MIN, value - 1))}
        icon={MinusSignIcon}
      />
      <span className="text-sm font-bold text-foreground">
        {value} {value === 1 ? "passageiro" : "passageiros"}
      </span>
      <StepButton
        ariaLabel="Aumentar vagas"
        disabled={value >= MAX}
        onClick={() => onChange(Math.min(MAX, value + 1))}
        icon={PlusSignIcon}
      />
    </div>
  );
}

type StepButtonProps = {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  icon: typeof MinusSignIcon;
};

function StepButton({ ariaLabel, disabled, onClick, icon }: StepButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-xl bg-muted text-foreground transition-colors hover:bg-muted/70 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <HugeiconsIcon icon={icon} size={16} strokeWidth={2} />
    </button>
  );
}
```

- [ ] **Step 2: `price-input.tsx`**

```tsx
// frontend/src/pages/hubs-novo/components/price-input.tsx
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
```

- [ ] **Step 3: `notes-textarea.tsx`**

```tsx
// frontend/src/pages/hubs-novo/components/notes-textarea.tsx
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
```

- [ ] **Step 4: `time-toggle.tsx`**

```tsx
// frontend/src/pages/hubs-novo/components/time-toggle.tsx
import { Checkbox } from "@/components/ui/checkbox";
import type { SavedRoute } from "@/pages/rotas/types";

type TimeToggleProps = {
  useSaved: boolean;
  onUseSavedChange: (next: boolean) => void;
  customTime: string;
  onCustomTimeChange: (value: string) => void;
  route: SavedRoute | null;
};

export function TimeToggle({
  useSaved,
  onUseSavedChange,
  customTime,
  onCustomTimeChange,
  route,
}: TimeToggleProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <label className="flex items-start gap-3">
        <Checkbox
          checked={useSaved}
          onCheckedChange={(checked) => onUseSavedChange(checked === true)}
          disabled={!route}
          className="mt-0.5"
        />
        <span className="flex flex-col">
          <span className="text-sm font-bold text-foreground">
            Usar horário cadastrado
          </span>
          {route ? (
            <span className="text-xs text-muted-foreground">
              Saída {route.departureTime} · {route.origin.label} →{" "}
              {route.destination.label}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Selecione uma rota primeiro
            </span>
          )}
        </span>
      </label>

      {!useSaved ? (
        <input
          type="time"
          value={customTime}
          onChange={(e) => onCustomTimeChange(e.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ) : null}
    </div>
  );
}
```

- [ ] **Step 5: `vehicle-card.tsx`**

```tsx
// frontend/src/pages/hubs-novo/components/vehicle-card.tsx
import { ArrowRight01Icon, Car03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router";

import type { Vehicle } from "@/pages/configuracoes/types";

type VehicleCardProps = {
  vehicle: Vehicle;
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/configuracoes")}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
        <HugeiconsIcon icon={Car03Icon} size={20} strokeWidth={1.75} />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-sm font-bold text-foreground">
          {vehicle.model}
        </span>
        <span className="text-xs text-muted-foreground">{vehicle.plate}</span>
      </span>
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.75} />
    </button>
  );
}
```

- [ ] **Step 6: `prereq-cta.tsx`**

```tsx
// frontend/src/pages/hubs-novo/components/prereq-cta.tsx
import { Alert01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type PrereqCTAProps = {
  message: string;
  ctaLabel: string;
  onClick: () => void;
};

export function PrereqCTA({ message, ctaLabel, onClick }: PrereqCTAProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-amber-100 text-amber-700">
        <HugeiconsIcon icon={Alert01Icon} size={20} strokeWidth={1.75} />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-sm font-bold text-foreground">{message}</span>
        <span className="text-xs text-primary">{ctaLabel}</span>
      </span>
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.75} />
    </button>
  );
}
```

- [ ] **Step 7: `route-picker.tsx`**

```tsx
// frontend/src/pages/hubs-novo/components/route-picker.tsx
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { SavedRoute } from "@/pages/rotas/types";

type RoutePickerProps = {
  routes: SavedRoute[];
  selected: SavedRoute | null;
  onSelect: (route: SavedRoute) => void;
};

export function RoutePicker({ routes, selected, onSelect }: RoutePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex flex-col">
          {selected ? (
            <>
              <span className="text-sm font-bold text-foreground">
                {selected.origin.label} → {selected.destination.label}
              </span>
              <span className="text-xs text-muted-foreground">
                Saída {selected.departureTime}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-muted-foreground">
              Escolher rota
            </span>
          )}
        </span>
        <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1.75} />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Escolher rota</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-2 pb-[env(safe-area-inset-bottom)]">
            {routes.map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() => {
                  onSelect(route);
                  setOpen(false);
                }}
                className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="text-sm font-bold text-foreground">
                  {route.origin.label} → {route.destination.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  Saída {route.departureTime}
                </span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
```

- [ ] **Step 8: Verificar tipos**

Run: `npm run check-types`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add frontend/src/pages/hubs-novo/components/
git commit -m "feat: sub-componentes do form de criar carona"
```

---

## Task 8: Página /hubs/novo (form principal)

**Files:**
- Create: `frontend/src/pages/hubs-novo/index.tsx`
- Modify: `frontend/src/routes.ts`

- [ ] **Step 1: Criar `pages/hubs-novo/index.tsx`**

```tsx
// frontend/src/pages/hubs-novo/index.tsx
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { loadJSON, saveJSON } from "@/lib/storage";
import type { Hub, HubMode } from "@/pages/caronas/types";
import type { Vehicle } from "@/pages/configuracoes/types";
import type { SavedRoute } from "@/pages/rotas/types";

import { NotesTextarea } from "./components/notes-textarea";
import { PrereqCTA } from "./components/prereq-cta";
import { PriceInput } from "./components/price-input";
import { RoutePicker } from "./components/route-picker";
import { SeatsStepper } from "./components/seats-stepper";
import { TimeToggle } from "./components/time-toggle";
import { VehicleCard } from "./components/vehicle-card";

function parseMode(raw: string | null): HubMode {
  return raw === "app" ? "app" : "carona";
}

export default function HubsNovoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = parseMode(searchParams.get("modo"));

  const [routes] = useState<SavedRoute[]>(() =>
    loadJSON<SavedRoute[]>("routes", []),
  );
  const [vehicle] = useState<Vehicle | null>(() =>
    loadJSON<Vehicle | null>("vehicle", null),
  );

  const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);
  const [useSavedTime, setUseSavedTime] = useState(true);
  const [customTime, setCustomTime] = useState("08:00");
  const [seats, setSeats] = useState(3);
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");

  const hasRoutes = routes.length > 0;
  const hasVehicle = vehicle !== null;
  const priceValue = Number(price.replace(",", "."));
  const validPrice = mode === "carona" ? priceValue > 0 : true;
  const canSubmit =
    selectedRoute !== null &&
    validPrice &&
    (mode === "app" || hasVehicle);

  function handleSubmit() {
    if (!selectedRoute || !canSubmit) return;
    const departureTime = useSavedTime ? selectedRoute.departureTime : customTime;
    const base = {
      id: crypto.randomUUID(),
      routeId: selectedRoute.id,
      departureTime,
      seats,
      createdAt: new Date().toISOString(),
    };
    let hub: Hub;
    if (mode === "carona") {
      if (!vehicle) return;
      hub = {
        ...base,
        mode: "carona",
        priceBRL: priceValue,
        vehicle,
      };
    } else {
      hub = {
        ...base,
        mode: "app",
        notes: notes.trim() || undefined,
      };
    }
    const current = loadJSON<Hub[]>("hubs", []);
    saveJSON("hubs", [...current, hub]);
    toast.success("Carona criada");
    navigate("/caronas");
  }

  return (
    <main className="bg-background flex min-h-svh w-full flex-col">
      <div className="mx-auto flex w-full max-w-100 flex-1 flex-col gap-5 px-5 pb-12 pt-8">
        <header className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={1.75} />
          </button>
          <div className="flex flex-col gap-1">
            <h1 className="text-[22px] font-bold leading-tight text-foreground">
              Cadastrar {mode === "carona" ? "carona" : "transporte"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {mode === "carona"
                ? "Compartilhe sua rota com a galera da PUCPR"
                : "Combine uma corrida de app com a galera"}
            </p>
          </div>
        </header>

        <section className="flex flex-col gap-2">
          <Label>Rota</Label>
          {hasRoutes ? (
            <RoutePicker
              routes={routes}
              selected={selectedRoute}
              onSelect={(r) => {
                setSelectedRoute(r);
                setUseSavedTime(true);
              }}
            />
          ) : (
            <PrereqCTA
              message="Nenhuma rota cadastrada"
              ctaLabel="Criar rota"
              onClick={() => navigate("/rotas")}
            />
          )}
        </section>

        <section className="flex flex-col gap-2">
          <Label>Horário</Label>
          <TimeToggle
            useSaved={useSavedTime}
            onUseSavedChange={setUseSavedTime}
            customTime={customTime}
            onCustomTimeChange={setCustomTime}
            route={selectedRoute}
          />
        </section>

        <section className="flex flex-col gap-2">
          <Label>Vagas disponíveis</Label>
          <SeatsStepper value={seats} onChange={setSeats} />
        </section>

        {mode === "carona" ? (
          <>
            <section className="flex flex-col gap-2">
              <Label>Valor por passageiro</Label>
              <PriceInput value={price} onChange={setPrice} />
            </section>

            <section className="flex flex-col gap-2">
              <Label>Veículo</Label>
              {hasVehicle ? (
                <VehicleCard vehicle={vehicle} />
              ) : (
                <PrereqCTA
                  message="Nenhum veículo cadastrado"
                  ctaLabel="Cadastrar veículo"
                  onClick={() => navigate("/configuracoes")}
                />
              )}
            </section>
          </>
        ) : (
          <section className="flex flex-col gap-2">
            <Label>Observação</Label>
            <NotesTextarea value={notes} onChange={setNotes} />
          </section>
        )}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-sm font-bold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Criar carona →
        </button>
      </div>
    </main>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Adicionar rota em `routes.ts`**

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/login/index.tsx"),
  route("login", "pages/login/index.tsx", { id: "login" }),
  route("register", "pages/register/index.tsx"),
  route("home", "pages/home/index.tsx"),
  route("perfil", "pages/perfil/index.tsx"),
  route("rotas", "pages/rotas/index.tsx"),
  route("caronas", "pages/caronas/index.tsx"),
  route("hubs/novo", "pages/hubs-novo/index.tsx"),
  route("configuracoes", "pages/configuracoes/index.tsx"),
] satisfies RouteConfig;
```

- [ ] **Step 3: Verificar tipos**

Run: `npm run check-types`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/hubs-novo/index.tsx frontend/src/routes.ts
git commit -m "feat: página /hubs/novo (form de criar carona)"
```

---

## Task 9: Verificação manual no browser

**Files:** nenhum (verificação)

- [ ] **Step 1: Subir o dev server**

Run: `npm run dev` (background)
Expected: backend em :3000 e frontend em :5173

- [ ] **Step 2: Limpar localStorage e abrir /home**

No DevTools: `localStorage.clear()`. Recarregar. Nav deve mostrar **Hubs / Rotas / + / Caronas / Perfil**.

- [ ] **Step 3: Tap + → Sheet abre com 2 cards**

Validar visual e que "Carona" navega para `/hubs/novo?modo=carona`.

- [ ] **Step 4: Form Carona sem rotas/veículo**

Esperado: ambos os campos mostram `PrereqCTA`, botão "Criar carona" desabilitado.

- [ ] **Step 5: Cadastrar veículo via /configuracoes e rota via /rotas**

Voltar a `/hubs/novo?modo=carona`. Escolher rota, deixar "Usar horário cadastrado" marcado, digitar valor `R$ 5`, ver veículo. Botão habilita.

- [ ] **Step 6: Criar → toast + redirect /caronas com card visível**

Card mostra: badge Carona, origem→destino, horário, vagas, R$ 5,00, modelo · placa.

- [ ] **Step 7: Voltar via + → App de transporte**

Esperado: form sem Valor nem Veículo, com Observação. Sem observação preenchida, criar; card mostra badge "App de transporte" sem valor/veículo.

- [ ] **Step 8: Override de horário**

Em novo form, desmarcar "Usar horário cadastrado", definir `09:30`, criar. Verificar que card mostra `09:30`.

- [ ] **Step 9: Reload da página em /caronas**

Esperado: hubs persistem (vindo do localStorage).

- [ ] **Step 10: Commit (se ajustes visuais forem necessários)**

Caso algum ajuste seja feito durante a verificação, agrupar num commit:

```bash
git add -A
git commit -m "fix: ajustes visuais pós-verificação manual"
```

---

## Self-review (registrado)

- **Cobertura do spec:**
  - Nav 5 itens + rebrand Hubs → Task 5
  - Sheet + 2 modos → Task 5 + 7
  - Form condicional carona/app → Task 8
  - Rota/Horário/Vagas/Valor/Veículo/Observação → Task 7 + 8
  - Pré-requisitos (rota/veículo) com CTA + submit desabilitado → Task 8
  - Lista /caronas + estado vazio → Task 6
  - Tipos Hub união discriminada → Task 4
  - localStorage como bridge → Task 1 + 2 + 6 + 8
  - Persistência rotas/veículo (mudança vs hoje) → Task 2
  - Componentes shadcn faltantes → Task 3
  - Verificação manual → Task 9

- **Sem placeholders.** Todo step tem código completo.

- **Consistência de tipos:** `Hub` é union de `CaronaHub | AppTransporteHub`, ambos extendem `HubBase`. Discriminante `mode`. `Vehicle` importado de `pages/configuracoes/types`. `SavedRoute` de `pages/rotas/types`. NavKey `"hubs" | "routes" | "rides" | "profile"` aplicado em todas pages do nav.

- **Pontos de atenção em runtime:**
  - `crypto.randomUUID()` está disponível no browser moderno; o codebase já usa em `pages/rotas/index.tsx`, OK.
  - Ícones `MinusSignIcon`, `PlusSignIcon`, `SmartPhone01Icon`, `UserGroupIcon`, `Alert01Icon` precisam existir em `@hugeicons/core-free-icons`. Se não existirem com esses nomes exatos, ajustar para o nome real do pacote (verificar via autocomplete da IDE durante a Task).
