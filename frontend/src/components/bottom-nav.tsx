import {
  Add01Icon,
  Home09Icon,
  Route01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type NavKey = "home" | "routes" | "profile";

type BottomNavProps = {
  active: NavKey;
};

type NavItem = {
  key: NavKey;
  label: string;
  icon: IconSvgElement;
  href: string | null;
};

const homeItem: NavItem = {
  key: "home",
  label: "Início",
  icon: Home09Icon,
  href: "/home",
};
const routesItem: NavItem = {
  key: "routes",
  label: "Rotas",
  icon: Route01Icon,
  href: null,
};
const profileItem: NavItem = {
  key: "profile",
  label: "Perfil",
  icon: UserIcon,
  href: "/perfil",
};

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className="sticky bottom-0 left-0 right-0 mt-auto border-t border-border bg-card"
    >
      <div className="relative mx-auto flex h-16 max-w-100 items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        <NavButton item={homeItem} active={active === homeItem.key} />
        <NavButton item={routesItem} active={active === routesItem.key} />

        <button
          type="button"
          aria-label="Criar nova carona"
          onClick={() => toast.info("Em breve")}
          className="grid size-13 -translate-y-4 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <HugeiconsIcon icon={Add01Icon} size={22} strokeWidth={2.25} />
        </button>

        <NavButton item={profileItem} active={active === profileItem.key} />
        <span className="w-10" aria-hidden="true" />
      </div>
    </nav>
  );
}

function NavButton({ item, active }: { item: NavItem; active: boolean }) {
  const navigate = useNavigate();

  function handleClick() {
    if (active) return;
    if (item.href) {
      navigate(item.href);
    } else {
      toast.info("Em breve");
    }
  }

  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={handleClick}
      className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-bold transition-colors focus-visible:outline-none ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <HugeiconsIcon icon={item.icon} size={20} strokeWidth={1.75} />
      <span>{item.label}</span>
    </button>
  );
}
