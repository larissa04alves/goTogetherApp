# Hubs: criar carona / app de transporte

**Status:** aprovado, pronto para plan
**Data:** 2026-05-26
**Escopo:** frontend apenas (mock local com Context)

## Objetivo

Permitir que o usuário publique uma "carona" (próprio carro) ou um "transporte por app" (99/Uber/etc) a partir do botão **+** central da bottom nav, reaproveitando rotas e veículo já cadastrados. Caronas criadas vivem em uma nova aba **Caronas** da nav.

## Mudanças na navegação

Bottom nav passa de 4 para **5 itens + FAB**:

```
[ Hubs ] [ Rotas ]   ( + )   [ Caronas ] [ Perfil ]
```

- **Hubs** (`/home`): renomeia o tab antes chamado "Início". Mantém a rota e o conteúdo atual (lista de caronas disponíveis de outros usuários).
- **Rotas** (`/rotas`): sem alteração.
- **+** FAB: abre `CreateHubSheet` (bottom sheet com 2 cards).
- **Caronas** (`/caronas`): NOVA. Lista as caronas criadas pelo próprio usuário.
- **Perfil** (`/perfil`): sem alteração.

Labels mantidos em todos os itens. Layout `flex-1` por item para distribuir; se ficar comprimido em telas pequenas, reduzir gap interno e font do label para 10px (já é o do mockup).

## Fluxo principal

```
Hubs/Caronas/qualquer rota → tap + da BottomNav
  └─ CreateHubSheet abre (shadcn Sheet, side="bottom")
      ├─ Card "Carona"          → navigate("/hubs/novo?modo=carona")
      └─ Card "App de transporte" → navigate("/hubs/novo?modo=app")
          └─ HubsNovoPage renderiza form condicional
              ├─ submit → HubsContext.add(hub)
              ├─ toast "Carona criada"
              └─ navigate("/caronas")
```

## Tela de criação (`/hubs/novo`)

Lê `?modo=carona|app` do search param. Campos:

| Campo | Carona | App |
|---|---|---|
| Rota (select de SavedRoute) | ✓ | ✓ |
| Horário (checkbox usar cadastrado + override) | ✓ | ✓ |
| Vagas (stepper 1–6) | ✓ | ✓ |
| Valor por passageiro (R$) | ✓ | — |
| Veículo (snapshot do config) | ✓ | — |
| Observação (textarea opcional, 200 chars) | — | ✓ |

**Header:** botão voltar + título "Cadastrar carona" + subtítulo "Compartilhe sua rota com a galera da PUCPR" (mockup Pencil `JKjYW`).

### Detalhes por campo

- **Rota**: card com chevron. Tap abre Sheet com lista de `SavedRoute`. Ao escolher, `departureTime` da rota popula o campo Horário.
- **Horário**: checkbox `Usar horário cadastrado` default `true`. Mostra "Saída HH:mm · origem → destino". Desmarcar revela `<input type="time">` controlado.
- **Vagas**: stepper `[-] N [+]`, limite hard-coded 1–6 (Vehicle não tem capacity; flag para futuro).
- **Valor por passageiro** (carona): `<input type="number" step="0.50" min="0.50">` com prefixo "R$". **Sem helper de sugestão.** Validação: obrigatório, > 0.
- **Veículo** (carona): card read-only com `{model} · {color} · {plate}` do `VehicleContext` (já existe em config). Tap → `navigate("/configuracoes")`.
- **Observação** (app): `<textarea maxLength={200}>`, opcional.

### Pré-requisitos e CTAs inline

- **Sem rota cadastrada**: Rota mostra `Criar rota` (botão inline que abre `RouteFormModal` reaproveitado de `pages/rotas/`). Submit desabilitado.
- **Modo carona, sem veículo**: Veículo mostra `Cadastrar veículo` (navega para `/configuracoes`). Submit desabilitado.
- Sem alerta intrusivo; CTAs são parte natural do formulário.

### Submit

Constrói `Hub` e chama `useHubs().add(hub)`. Toast `Carona criada`. Navega para `/caronas`.

### Cancelar / voltar

Botão voltar do header descarta state local (sem prompt — formulário curto).

### Troca de modo

Não há toggle de modo dentro da tela. Modo é fixado pelo search param. Voltar e re-entrar pelo + permite trocar.

## Lista "Minhas caronas" (`/caronas`)

- Header com título "Minhas caronas" + contagem.
- Lista de `HubCard` ordenada por `createdAt` desc.
- Estado vazio: `EmptyHubs` com CTA "Criar primeira carona" que abre o `CreateHubSheet`.

`HubCard` mostra: badge de modo (Carona/App), origem → destino da rota, horário, vagas, valor (se carona), veículo (se carona), observação truncada (se app).

## Modelo de dados (frontend)

```ts
// pages/caronas/types.ts
import type { Vehicle } from "@/pages/configuracoes/types";

export type HubBase = {
  id: string;
  routeId: string;
  departureTime: string;      // "HH:mm"
  seats: number;
  createdAt: string;          // ISO
};

export type CaronaHub = HubBase & {
  mode: "carona";
  priceBRL: number;
  vehicle: Vehicle;           // snapshot na criação
};

export type AppTransporteHub = HubBase & {
  mode: "app";
  notes?: string;
};

export type Hub = CaronaHub | AppTransporteHub;
```

## Estado compartilhado

`HubsProvider` em `root.tsx` (acima do `<Outlet/>`). API:

```ts
type HubsContextValue = {
  hubs: Hub[];
  add: (hub: Hub) => void;
  remove: (id: string) => void;
};
```

Implementação: `useState<Hub[]>([])`. Sem persistência em disco nesta fase (mesmo padrão do `rotas/` e `configuracoes/` hoje).

Para acessar rotas salvas e veículo, criar também:

- `RoutesProvider` em `root.tsx` movendo o `useState` que hoje está em `pages/rotas/index.tsx`.
- `VehicleProvider` em `root.tsx` movendo o `useState` que hoje está em `pages/configuracoes/index.tsx`.

Sem isso a tela de criação não tem como ler as rotas/veículo. Os providers ficam em `src/lib/state/` (`hubs-context.tsx`, `routes-context.tsx`, `vehicle-context.tsx`).

## Componentes novos

```
frontend/src/lib/state/
  hubs-context.tsx          ← provider + useHubs()
  routes-context.tsx        ← provider + useRoutes() (lift do rotas/)
  vehicle-context.tsx       ← provider + useVehicle() (lift do configuracoes/)

frontend/src/components/
  bottom-nav.tsx            ← MODIFICADO (+ Caronas, rebrand Hubs, + abre sheet)
  create-hub-sheet.tsx      ← NOVO (Sheet shadcn com 2 cards de modo)

frontend/src/pages/caronas/  ← NOVA rota
  index.tsx
  types.ts
  components/
    hub-card.tsx
    empty-hubs.tsx

frontend/src/pages/hubs-novo/ ← NOVA rota
  index.tsx                  ← form condicional por modo
  components/
    route-picker.tsx
    time-toggle.tsx
    seats-stepper.tsx
    price-input.tsx
    vehicle-card.tsx
    notes-textarea.tsx
    prereq-cta.tsx
```

## Rotas

```ts
// frontend/src/routes.ts
route("caronas", "pages/caronas/index.tsx"),
route("hubs/novo", "pages/hubs-novo/index.tsx"),
```

## BottomNav: mudança no botão +

Hoje o `+` no `bottom-nav.tsx` chama `toast.info("Em breve")`. Substituir por estado que controla abertura do `CreateHubSheet`. Sheet é renderizado dentro do próprio `BottomNav` para ficar disponível em toda página que usa a nav.

Adicionar tipo `NavKey`: `"hubs" | "routes" | "rides" | "profile"` (rides = caronas do usuário). Pages atualizam o `active` prop correspondente.

## Estilos

- Seguir o mockup Pencil `JKjYW` no `pencil-welcome-desktop.pen`: cards brancos com `cornerRadius:14` e border `#e2e8f0`, label section em `#94a3b8` uppercase 11px `font-weight:600 letter-spacing:1.5`.
- Botão primário verde-água (já existe no theme via `bg-primary` — `#2ddda8` no mockup, validar contra o tema atual).
- Tudo dentro do container `max-w-100 mx-auto` igual outras pages.
- Usar shadcn `Sheet`, `Button`, `Input`, `Checkbox`, `Textarea`. Adicionar via MCP shadcn os que faltarem.

## Erros e edge cases

- Sem rotas / sem veículo: CTAs inline, submit desabilitado.
- Modo carona sem `priceBRL > 0`: submit desabilitado.
- Trocar de modo após preencher: state local descartado (URL muda).
- Voltar sem submeter: descarta.
- Reload da página: estado dos providers volta a vazio. Aceito nesta fase (mesmo comportamento de `rotas`/`vehicle` hoje).
- BottomNav em telas < 360px: avaliar visualmente; se quebrar, reduzir gap e font do label a 9px.

## Testes

Não há suíte de testes no frontend. Verificação manual via `agent-browser` no fim:

1. Renomear funciona, nav mostra 5 itens.
2. + abre sheet, escolher Carona navega com `?modo=carona`.
3. Form Carona com rota+veículo válidos cria hub e aparece em /caronas.
4. Form App sem valor/veículo cria hub correto.
5. Sem rota → CTA aparece, submit desabilitado.
6. Modo carona sem veículo → CTA aparece, submit desabilitado.

## Fora de escopo

- Backend (POST /api/rides, persistência, Drizzle schema): outra spec.
- Edição/exclusão de hub criado.
- Notificações para outros usuários sobre nova carona.
- Cálculo de sugestão de valor.
- Validação de capacity por veículo.
- Persistência local (localStorage / IndexedDB).

## Decisões registradas

- **5 itens na nav** (não compactar para 4) — usuário aprovou.
- **Estado partilhado via Context em `root.tsx`** — usuário aprovou; alternativa `localStorage` adiada.
- **Sem helper de sugestão de valor** — usuário decidiu; helper removido do mockup.
- **Mock local, sem backend** — alinha com o resto do app hoje.
