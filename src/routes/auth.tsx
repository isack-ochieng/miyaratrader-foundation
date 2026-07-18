import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TrendingUp, ArrowLeft } from "lucide-react";

const searchSchema = z.object({ mode: z.enum(["signin", "signup", "reset"]).optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
  head: () => ({ meta: [{ title: "Sign in — MiyaraTrader" }, { name: "description", content: "Sign in or create a MiyaraTrader account." }, { name: "robots", content: "noindex" }] }),
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">(search.mode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMode(search.mode ?? "signin"); }, [search.mode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your inbox to verify your email.");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset email sent.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error("Google sign-in failed"); setLoading(false); return; }
    if (!result.redirected) navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 grid-fade opacity-40" aria-hidden />
      <Link to="/" className="absolute top-6 left-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </span>
            Miyara<span className="text-gradient-emerald">Trader</span>
          </Link>
        </div>
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-display font-bold">
            {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Sign in to your trading workspace" : mode === "signup" ? "Start trading in minutes" : "We'll email you a reset link"}
          </p>

          {mode !== "reset" && (
            <>
              <Button type="button" variant="outline" className="w-full mt-6 h-11" onClick={handleGoogle} disabled={loading}>
                <GoogleIcon /> Continue with Google
              </Button>
              <div className="relative my-5"><span className="absolute inset-x-0 top-1/2 h-px bg-border" /><span className="relative bg-card px-3 text-xs text-muted-foreground mx-auto block w-fit">or with email</span></div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} required className="h-11 mt-1.5" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-11 mt-1.5" />
            </div>
            {mode !== "reset" && (
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="pw">Password</Label>
                  {mode === "signin" && (
                    <button type="button" onClick={() => setMode("reset")} className="text-xs text-primary hover:underline">Forgot?</button>
                  )}
                </div>
                <Input id="pw" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="h-11 mt-1.5" />
              </div>
            )}
            <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>Don't have an account?{" "}<button onClick={() => setMode("signup")} className="text-primary hover:underline">Sign up</button></>
            ) : mode === "signup" ? (
              <>Already have an account?{" "}<button onClick={() => setMode("signin")} className="text-primary hover:underline">Sign in</button></>
            ) : (
              <button onClick={() => setMode("signin")} className="text-primary hover:underline">Back to sign in</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
