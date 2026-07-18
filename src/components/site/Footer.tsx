import { TrendingUp } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
            </span>
            Miyara<span className="text-gradient-emerald">Trader</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            A cloud trading platform built around the Deriv ecosystem.
          </p>
        </div>
        <FooterCol title="Platform" items={["Features", "Roadmap", "Trading", "Dashboard"]} />
        <FooterCol title="Company" items={["About", "Contact", "Careers", "Press"]} />
        <FooterCol title="Legal" items={["Terms", "Privacy", "Risk disclosure", "Cookies"]} />
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MiyaraTrader. Trading involves risk. Past performance does not guarantee future results.
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map(i => <li key={i}><a href="#" className="hover:text-foreground">{i}</a></li>)}
      </ul>
    </div>
  );
}
