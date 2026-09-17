import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  className,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && (
          <div className="text-xs uppercase tracking-widest text-primary mb-2">{eyebrow}</div>
        )}
        <h1 className="text-2xl md:text-3xl font-display font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("glass rounded-2xl p-6", className)}>{children}</div>;
}

export function ComingSoon({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="glass rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden min-h-64 justify-center">
      <div className="absolute inset-0 grid-fade opacity-30" aria-hidden />
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4">
        <Icon className="h-5 w-5" />
      </span>
      <div className="text-[10px] font-semibold uppercase tracking-widest rounded-full bg-primary/20 text-primary px-2 py-1 mb-3">
        Coming in Phase 2
      </div>
      <h3 className="font-display font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
    </div>
  );
}
