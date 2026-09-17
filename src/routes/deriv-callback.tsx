import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { parseDerivCallback } from "@/lib/deriv";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/deriv-callback")({
  head: () => ({
    meta: [
      { title: "Deriv connection — MiyaraTrader" },
      { name: "description", content: "Deriv account connection status." },
      { property: "og:title", content: "Deriv connection — MiyaraTrader" },
      { property: "og:description", content: "Deriv account connection status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DerivCallback,
});

function DerivCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ok" | "err">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const search = window.location.search + window.location.hash.replace(/^#/, "&");
        const accounts = parseDerivCallback(search);
        window.history.replaceState({}, "", "/deriv-callback");
        if (accounts.length === 0) {
          setStatus("err");
          setMessage("No account data returned from Deriv. Try again or use manual token entry.");
          return;
        }
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
          setStatus("err");
          setMessage("You need to be signed in.");
          return;
        }
        window.history.replaceState({}, "", "/deriv-callback");
        setStatus("err");
        setMessage("Deriv connection setup is incomplete. No access tokens have been saved.");
      } catch (e) {
        setStatus("err");
        setMessage(e instanceof Error ? e.message : "Something went wrong.");
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero px-4">
      <div className="glass rounded-2xl p-10 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <div className="mt-4 font-semibold">Linking your Deriv account…</div>
          </>
        )}
        {status === "ok" && (
          <>
            <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
            <div className="mt-4 font-display text-xl font-semibold">Connected!</div>
            <div className="text-sm text-muted-foreground mt-1">Taking you to your dashboard…</div>
          </>
        )}
        {status === "err" && (
          <>
            <XCircle className="h-10 w-10 text-destructive mx-auto" />
            <div className="mt-4 font-display text-xl font-semibold">Connection failed</div>
            <div className="text-sm text-muted-foreground mt-2">{message}</div>
            <Button className="mt-6" onClick={() => navigate({ to: "/connect-deriv" })}>
              Try again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
