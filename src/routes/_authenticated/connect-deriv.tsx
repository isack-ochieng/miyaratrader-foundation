import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader, Card } from "@/components/app/AppUI";
import { buildDerivAuthUrl } from "@/lib/deriv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, ShieldCheck, CheckCircle2, XCircle, Info, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/connect-deriv")({
  component: ConnectDerivPage,
});

interface Conn { id: string; account_id: string; currency: string; balance: number; status: string; is_virtual: boolean; last_synced_at: string | null }

function ConnectDerivPage() {
  const [connections, setConnections] = useState<Conn[]>([]);
  const [loading, setLoading] = useState(true);
  const [manualToken, setManualToken] = useState("");
  const [manualAccount, setManualAccount] = useState("");
  const [manualCurrency, setManualCurrency] = useState("USD");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function refresh() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const { data } = await supabase.from("deriv_connections").select("*").eq("user_id", user.user.id).order("created_at", { ascending: false });
    setConnections((data ?? []) as Conn[]);
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  function startOAuth() {
    const redirect = `${window.location.origin}/deriv-callback`;
    window.location.href = buildDerivAuthUrl(redirect);
  }

  async function saveManual(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const { error } = await supabase.from("deriv_connections").upsert({
      user_id: user.user.id,
      account_id: manualAccount.trim(),
      currency: manualCurrency.trim().toUpperCase(),
      token_encrypted: manualToken.trim(),
      is_virtual: manualAccount.trim().toUpperCase().startsWith("VR"),
      status: "connected",
      last_synced_at: new Date().toISOString(),
    }, { onConflict: "user_id,account_id" });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Deriv account connected");
    setManualToken(""); setManualAccount("");
    refresh();
  }

  async function disconnect(id: string) {
    const { error } = await supabase.from("deriv_connections").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Disconnected");
    refresh();
  }

  return (
    <PageContainer>
      <PageHeader eyebrow="Deriv connection" title="Link your Deriv account." subtitle="Securely connect via Deriv's official OAuth or enter an API token manually." />

      {connections.length > 0 && (
        <Card>
          <div className="text-sm font-semibold mb-4">Connected accounts</div>
          <div className="space-y-2">
            {connections.map(c => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_4px_oklch(0.72_0.16_160/0.2)]" />
                  <div>
                    <div className="font-semibold flex items-center gap-2">{c.account_id} <span className="text-[10px] uppercase tracking-widest rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{c.is_virtual ? "Demo" : "Real"}</span></div>
                    <div className="text-xs text-muted-foreground">{c.currency} · {c.balance?.toFixed?.(2) ?? "0.00"} · synced {c.last_synced_at ? new Date(c.last_synced_at).toLocaleString() : "—"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs flex items-center gap-1 text-primary"><CheckCircle2 className="h-4 w-4" /> Healthy</span>
                  <Button variant="ghost" size="sm" onClick={() => disconnect(c.id)}><Trash2 className="h-4 w-4"/></Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2 text-primary mb-3"><ShieldCheck className="h-5 w-5"/> <span className="text-xs uppercase tracking-widest">Recommended</span></div>
          <h2 className="text-xl font-display font-semibold">Connect with Deriv OAuth</h2>
          <p className="text-sm text-muted-foreground mt-2">
            You'll be redirected to Deriv to authorize MiyaraTrader. We never see your password.
            After approving, we'll return you here with your accounts linked.
          </p>
          <ol className="mt-4 text-sm space-y-2 text-muted-foreground">
            <li className="flex gap-2"><span className="text-primary">1.</span> Click the button below</li>
            <li className="flex gap-2"><span className="text-primary">2.</span> Log in to Deriv and approve access</li>
            <li className="flex gap-2"><span className="text-primary">3.</span> You'll be returned to MiyaraTrader</li>
          </ol>
          <Button className="mt-6 h-11 glow-emerald" onClick={startOAuth}>
            Connect with Deriv <ExternalLink className="ml-2 h-4 w-4"/>
          </Button>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-muted-foreground mb-3"><Info className="h-4 w-4"/> <span className="text-xs uppercase tracking-widest">Manual entry</span></div>
          <h2 className="text-xl font-display font-semibold">Enter an API token</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Create an API token at <a className="text-primary underline" href="https://app.deriv.com/account/api-token" target="_blank" rel="noreferrer">Deriv → API Token</a> and paste it below.
          </p>
          <form onSubmit={saveManual} className="mt-4 space-y-3">
            <div><Label>Account ID</Label><Input value={manualAccount} onChange={e=>setManualAccount(e.target.value)} placeholder="CR1234567 or VRTC1234567" required className="mt-1.5 h-10" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Currency</Label><Input value={manualCurrency} onChange={e=>setManualCurrency(e.target.value)} required className="mt-1.5 h-10" /></div>
              <div><Label>API token</Label><Input type="password" value={manualToken} onChange={e=>setManualToken(e.target.value)} required className="mt-1.5 h-10" /></div>
            </div>
            <Button type="submit" variant="outline" className="w-full h-10" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin"/>} Save connection
            </Button>
          </form>
        </Card>
      </div>

      {loading && connections.length === 0 && (
        <Card><div className="text-sm text-muted-foreground flex items-center gap-2"><XCircle className="h-4 w-4"/> No accounts connected yet.</div></Card>
      )}

      <div className="text-xs text-muted-foreground text-center">
        Full live balance sync, positions, and trade streaming arrive in Phase 2.
      </div>
    </PageContainer>
  );
}
