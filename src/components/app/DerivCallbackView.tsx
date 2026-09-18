import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseDerivCallback } from "@/lib/deriv";
import { saveDerivAccounts } from "@/lib/deriv.functions";
import { supabase } from "@/integrations/supabase/client";

export function DerivCallbackView({ cleanPath }: { cleanPath: string }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ok" | "err">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const search = window.location.search + window.location.hash.replace(/^#/, "&");
        const accounts = parseDerivCallback(search);
        window.history.replaceState({}, "", cleanPath);

        if (accounts.length === 0) {
          setStatus("err");
          setMessage("No account data was returned from Deriv. Please try again.");
          return;
        }

        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
          setStatus("err");
          setMessage("Please sign in to MiyaraTrader first, then link your Deriv account.");
          return;
        }

        await saveDerivAccounts({ data: { accounts } });
        setStatus("ok");
        setTimeout(() => navigate({ to: "/connect-deriv", replace: true }), 1200);
      } catch (e) {
        setStatus("err");
        setMessage(e instanceof Error ? e.message : "Something went wrong.");
      }
    })();
  }, [navigate, cleanPath]);

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
            <div className="mt-4 font-display text-xl font-semibold">Account linked</div>
            <div className="text-sm text-muted-foreground mt-1">Taking you to your accounts…</div>
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
