import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/#features", label: "Features" },
  { to: "/#why", label: "Why us" },
  { to: "/#roadmap", label: "Roadmap" },
  { to: "/#faq", label: "FAQ" },
  { to: "/#contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
        <nav className="glass rounded-2xl px-4 py-2.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
            </span>
            <span>Miyara<span className="text-gradient-emerald">Trader</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <a key={l.to} href={l.to} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition">
                {l.label}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2">
            {authed ? (
              <Button asChild size="sm"><Link to="/dashboard">Dashboard</Link></Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
                <Button asChild size="sm"><Link to="/auth" search={{ mode: "signup" }}>Get started</Link></Button>
              </>
            )}
          </div>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
          </button>
        </nav>
        {open && (
          <div className="glass mt-2 rounded-2xl p-3 md:hidden">
            {links.map(l => (
              <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="block px-3 py-2 text-sm">{l.label}</a>
            ))}
            <div className="mt-2 flex gap-2">
              {authed ? (
                <Button asChild className="flex-1"><Link to="/dashboard">Dashboard</Link></Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="flex-1"><Link to="/auth">Sign in</Link></Button>
                  <Button asChild className="flex-1"><Link to="/auth">Get started</Link></Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
