import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, PageContainer, Card } from "@/components/app/AppUI";
import { ArrowRight, Bell, CheckCircle2, Clock, LineChart, Link2, TrendingUp, Bot, GraduationCap, Wallet, Users, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — MiyaraTrader" },
      { name: "description", content: "MiyaraTrader account overview and saved connection details." },
      { property: "og:title", content: "Dashboard — MiyaraTrader" },
      { property: "og:description", content: "MiyaraTrader account overview and saved connection details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

interface DerivConn {
  account_id: string;
  currency: string | null;
  balance: number | null;
  status: string;
  is_virtual: boolean | null;
}
interface Profile {
  full_name: string | null;
  email: string | null;
}

function DashboardPage() {
  const [conn, setConn] = useState<DerivConn | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      const [{ data: connData }, { data: profData }] = await Promise.all([
        supabase.from("deriv_connections").select("account_id,currency,balance,status,is_virtual").eq("user_id", user.user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("profiles").select("full_name,email").eq("id", user.user.id).maybeSingle(),
      ]);
      setConn(connData);
      setProfile(profData);
    })();
  }, []);

  const name = profile?.full_name?.split(" ")[0] ?? "Trader";

  return (
    <PageContainer>
      <PageHeader eyebrow="Dashboard" title={`Welcome back, ${name}.`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="relative overflow-hidden lg:col-span-2">
          <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-hero)" }} />
          <div className="text-xs uppercase tracking-widest text-primary">Account access</div>
          <h2 className="mt-2 text-2xl font-display font-semibold">{conn ? "Deriv account" : "No Deriv account linked"}</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{conn ? "Your linked Deriv account is ready for the Phase 1 workspace." : "Connect your Deriv account to populate your trading workspace."}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {conn ? <Button asChild><Link to="/trading">Open trading <ArrowRight className="ml-1 h-4 w-4" /></Link></Button> : <Button asChild><Link to="/connect-deriv">Connect Deriv <Link2 className="ml-1 h-4 w-4" /></Link></Button>}
            <Button asChild variant="outline"><Link to="/profile">Complete profile</Link></Button>
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Connection status</div>
          <div className="mt-3 flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${conn ? "bg-primary shadow-[0_0_0_4px_oklch(0.72_0.16_160/0.2)]" : "bg-muted-foreground/60"}`} />
            <div className="font-medium">{conn ? "Account linked" : "Not connected"}</div>
          </div>
          {conn && <div className="mt-4 space-y-2 text-sm"><Row k="Account" v={conn.account_id} /><Row k="Currency" v={conn.currency} /><Row k="Type" v={conn.is_virtual ? "Demo" : "Real"} /><Row k="Balance" v={`${conn.balance?.toFixed?.(2) ?? "—"} ${conn.currency ?? ""}`} /></div>}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={TrendingUp} title="Trading summary">
          <div className="text-3xl font-semibold">{conn ? conn.balance?.toFixed?.(2) ?? "—" : "—"}<span className="ml-1 text-sm text-muted-foreground">{conn?.currency ?? ""}</span></div>
          <div className="mt-1 text-xs text-muted-foreground">Last recorded balance</div>
        </SummaryCard>
        <SummaryCard icon={Clock} title="Recent activity">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Account created</li>
            {conn && <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Deriv account connected</li>}
            <li className="flex gap-2 opacity-60"><Clock className="h-4 w-4 shrink-0" /> No further activity recorded</li>
          </ul>
        </SummaryCard>
        <SummaryCard icon={Bell} title="Announcements">
          <p className="text-sm">Phase 1 account management and Deriv connection are available.</p>
          <p className="mt-1 text-xs text-muted-foreground">Trading execution and advanced modules remain scheduled for later phases.</p>
        </SummaryCard>
      </div>

      <section>
        <PageHeader className="mb-4" eyebrow="Workspace" title="Quick actions" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAction to="/trading" icon={LineChart} label="Open trading" />
          <QuickAction to="/connect-deriv" icon={Link2} label="Manage connection" />
          <QuickAction to="/profile" icon={TrendingUp} label="Edit profile" />
          <QuickAction to="/settings" icon={Bell} label="Preferences" />
        </div>
      </section>

      <section>
        <PageHeader className="mb-4" eyebrow="Planned modules" title="Future workspace" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {future.map((f) => (
            <Card key={f.title} className="min-h-36">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"><f.icon className="h-4 w-4" /></span>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">Coming soon</span>
              </div>
              <div className="mt-4 font-semibold">{f.title}</div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

const future = [
  { icon: GraduationCap, title: "Education Platform", body: "Courses, mentorship, and structured learning paths." },
  { icon: Bot, title: "Trading Bots", body: "Automate strategies and let bots trade on your behalf." },
  { icon: Users, title: "Affiliate Dashboard", body: "Referral tracking and commission analytics." },
  { icon: Wallet, title: "Wallet", body: "Wallet balances, withdrawals, and transaction history." },
  { icon: Copy, title: "Copy Trading", body: "Follow selected traders and mirror their trades." },
  { icon: TrendingUp, title: "Advanced Analytics", body: "Detailed performance and risk analytics." },
];

function SummaryCard({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return <Card className="min-h-40"><div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Icon className="h-4 w-4 text-primary" /> {title}</div>{children}</Card>;
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span></div>;
}

function QuickAction({ to, icon: Icon, label }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return <Link to={to} className="group flex min-h-16 items-center gap-3 rounded-xl border border-border/70 bg-card/60 px-4 py-3 transition hover:border-primary/40 hover:bg-primary/5"><span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"><Icon className="h-4 w-4" /></span><span className="text-sm font-medium">{label}</span><ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" /></Link>;
}
