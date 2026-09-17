import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, PageContainer, Card } from "@/components/app/AppUI";
import { ArrowRight, Bell, CheckCircle2, Clock, LineChart, Link2, TrendingUp, Bot, GraduationCap, Wallet, Users, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

interface DerivConn { account_id: string; currency: string | null; balance: number | null; status: string; is_virtual: boolean | null }
interface Profile { full_name: string | null; email: string | null }

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
      <PageHeader eyebrow="Dashboard" title={`Welcome back, ${name}.`}  />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-hero)" }} />
          <div className="text-xs uppercase tracking-widest text-primary">Account access</div>
          <h2 className="mt-2 text-2xl font-display font-semibold">{conn ? "Deriv account" : "No Deriv account linked"}</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            Account details reflect the last saved connection. Live trading is not available.
          </p>
          <div className="mt-6 flex gap-3">
            {conn ? (
              <Button asChild><Link to="/trading">Open trading <ArrowRight className="ml-1 h-4 w-4"/></Link></Button>
            ) : (
              <Button asChild><Link to="/connect-deriv">Connect Deriv <Link2 className="ml-1 h-4 w-4"/></Link></Button>
            )}
            <Button asChild variant="outline"><Link to="/profile">Complete profile</Link></Button>
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Connection status</div>
          <div className="mt-3 flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${conn ? "bg-primary shadow-[0_0_0_4px_oklch(0.72_0.16_160/0.2)]" : "bg-muted-foreground/60"}`} />
            <div className="font-medium">{conn ? "Account linked" : "Not connected"}</div>
          </div>
          {conn && (
            <div className="mt-4 text-sm space-y-1">
              <Row k="Account" v={conn.account_id} />
              <Row k="Currency" v={conn.currency} />
              <Row k="Type" v={conn.is_virtual ? "Demo" : "Real"} />
              <Row k="Balance" v={`${conn.balance?.toFixed?.(2) ?? "—"} ${conn.currency}`} />
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-4">
        <Card>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><TrendingUp className="h-4 w-4 text-primary"/> Trading summary</div>
          <div className="mt-3 text-3xl font-semibold">{conn ? `${conn.balance?.toFixed?.(2) ?? "—"}` : "—"}<span className="text-sm text-muted-foreground ml-1">{conn?.currency ?? ""}</span></div>
          <div className="text-xs text-muted-foreground mt-1">Last recorded balance</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-primary"/> Recent activity</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0"/> Account created</li>
            {conn && <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0"/> Deriv account connected</li>}
            <li className="flex gap-2 opacity-60"><Clock className="h-4 w-4 shrink-0"/> No further activity recorded</li>
          </ul>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Bell className="h-4 w-4 text-primary"/> Announcements</div>
          <div className="mt-3 text-sm">Trading execution is not available.</div>
          <div className="mt-1 text-xs text-muted-foreground">This release supports account management and connection records.</div>
        </Card>
      </div>

      <PageHeader className="mt-12" eyebrow="Quick actions" title="Workspace" />
      <div className="grid gap-4 md:grid-cols-4">
        <QuickAction to="/trading" icon={LineChart} label="Open trading" />
        <QuickAction to="/connect-deriv" icon={Link2} label="Manage connection" />
        <QuickAction to="/profile" icon={TrendingUp} label="Edit profile" />
        <QuickAction to="/settings" icon={Bell} label="Preferences" />
      </div>

      <PageHeader className="mt-12" eyebrow="Coming soon" title="Planned modules" />
      <div className="grid gap-4 md:grid-cols-3">
        {future.map(f => (
          <Card key={f.title} className="opacity-90">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary"><f.icon className="h-4 w-4" /></span>
              <span className="text-[10px] font-semibold uppercase tracking-widest rounded-full bg-muted px-2 py-1 text-muted-foreground">Coming soon</span>
            </div>
            <div className="mt-3 font-semibold">{f.title}</div>
            
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}

const future = [
  { icon: GraduationCap, title: "Education Platform", body: "Courses, mentorship, and structured learning paths." },
  { icon: Bot, title: "Trading Bots", body: "Automate strategies and let bots trade on your behalf." },
  { icon: Users, title: "Affiliate Dashboard", body: "Grow your network and earn commissions." },
  { icon: Wallet, title: "Wallet", body: "Multi-currency wallet with deposits and withdrawals." },
  { icon: Copy, title: "Copy Trading", body: "Follow top traders and mirror their trades." },
  { icon: TrendingUp, title: "Advanced Analytics", body: "Deep performance and risk analytics." },
];

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}

function QuickAction({ to, icon: Icon, label }: { to: string; icon: React.ComponentType<{className?:string}>; label: string }) {
  return (
    <Link to={to} className="glass rounded-xl p-4 flex items-center gap-3 hover:border-primary/40 transition">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary"><Icon className="h-4 w-4"/></span>
      <span className="text-sm font-medium">{label}</span>
      <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
    </Link>
  );
}
