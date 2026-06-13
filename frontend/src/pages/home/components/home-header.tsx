import { Notification03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type HomeHeaderProps = {
  userName: string;
};

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function HomeHeader({ userName }: HomeHeaderProps) {
  const greeting = getGreeting(new Date().getHours());
  const firstName = getFirstName(userName);

  return (
    <header className="flex w-full items-start justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] text-muted-foreground">{greeting},</span>
        <h1 className="text-[22px] font-bold leading-tight text-foreground">
          {firstName}
        </h1>
      </div>
      <button
        type="button"
        aria-label="Notificações"
        className="relative flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <HugeiconsIcon
          icon={Notification03Icon}
          size={20}
          strokeWidth={1.75}
        />
        <span
          aria-hidden="true"
          className="absolute right-2 top-2 size-2 rounded-full bg-destructive"
        />
      </button>
    </header>
  );
}
