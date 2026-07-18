import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, LineChart, User, Bell, Settings, LogOut, TrendingUp, Link2, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/trading", label: "Trading", icon: LineChart },
  { to: "/connect-deriv", label: "Connect Deriv", icon: Link2 },
  { to: "/profile", label: "My Account", icon: User },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: s => s.location.pathname });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-border/60 flex-col bg-sidebar">
        <SidebarInner pathname={pathname} email={email} onSignOut={signOut} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-64 h-full bg-sidebar border-r border-border/60 flex flex-col">
            <SidebarInner pathname={pathname} email={email} onSignOut={signOut} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border/60 flex items-center justify-between px-4 md:px-6 bg-background/70 backdrop-blur sticky top-0 z-40">
          <button className="md:hidden p-2 -ml-2" onClick={() => setOpen(true)} aria-label="Menu"><Menu className="h-5 w-5"/></button>
          <div className="text-sm text-muted-foreground hidden md:block">{pageTitle(pathname)}</div>
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
            </Link>
            <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
              {email.slice(0, 1).toUpperCase() || "U"}
            </div>
          </div>
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function SidebarInner({ pathname, email, onSignOut, onNavigate }: { pathname: string; email: string; onSignOut: () => void; onNavigate?: () => void }) {
  return (
    <>
      <Link to="/" onClick={onNavigate} className="h-14 flex items-center gap-2 px-5 font-display font-bold border-b border-border/60">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <TrendingUp className="h-3.5 w-3.5" />
        </span>
        <span>Miyara<span className="text-gradient-emerald">Trader</span></span>
      </Link>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} onClick={onNavigate}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition",
                active ? "bg-primary/15 text-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent")}>
              <Icon className="h-4 w-4" /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/60">
        <div className="px-2 py-2 text-xs text-muted-foreground truncate">{email}</div>
        <Button variant="ghost" onClick={onSignOut} className="w-full justify-start text-sm">
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </div>
    </>
  );
}

function pageTitle(path: string) {
  const item = nav.find(n => n.to === path);
  return item?.label ?? "";
}
