import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — MiyaraTrader" },
      { name: "description", content: "Reset your MiyaraTrader account password." },
      { property: "og:title", content: "Reset password — MiyaraTrader" },
      { property: "og:description", content: "Reset your MiyaraTrader account password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase handles the recovery link and sets session; just wait a beat.
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated. You're signed in.");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-display font-bold text-2xl">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </span>
            Miyara<span className="text-gradient-emerald">Trader</span>
          </div>
        </div>
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-display font-bold">Set a new password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter a new password to secure your account.
          </p>
          {!ready && (
            <div className="mt-4 text-xs text-muted-foreground">
              Waiting for recovery link… If nothing happens, request a new reset email.
            </div>
          )}
          <form onSubmit={submit} className="space-y-4 mt-6">
            <div>
              <Label>New password</Label>
              <Input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 mt-1.5"
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading || !ready}>
              {loading ? "Updating…" : "Update password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
